import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges
} from '@xyflow/react';

import { syncIAtoStory } from '../lib/sync/iaSync';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { debounce } from '../lib/sync/debounce';
import { analyzeProject } from '../lib/ai/suggestionEngine';

import type { Suggestion } from '../lib/ai/rules';

export type Tab = 'story' | 'ia' | 'userflow';
export type StoryPhase = 'idealization' | 'interrogation' | 'generation' | 'review';
export type SyncStatus = 'saved' | 'saving' | 'error' | 'unsaved';

export interface Message {
    id: string;
    role: 'system' | 'user';
    content: string;
    timestamp: number;
}

export interface StructuredStory {
    productName: string;
    description: string;
    targetUsers: string[];
    userRoles: string[];
    keyFeatures: string[];
    primaryUserActions: string[];
    systemModules: string[];
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
}

interface LayrState {
    projectId: string | null;
    projectTitle: string;
    syncStatus: SyncStatus;
    lastSaved: number | null;

    currentTab: Tab;
    storyPhase: StoryPhase;
    storyData: string;
    chatHistory: Message[];
    structuredStory: StructuredStory | null;

    notifications: Notification[];
    lastSyncSource: 'ia' | 'userflow' | null;
    suggestions: Suggestion[];

    userPlan: 'free' | 'pro';
    setUserPlan: (plan: 'free' | 'pro') => void;

    iaNodes: Node[];
    iaEdges: Edge[];

    userflowNodes: Node[];
    userflowEdges: Edge[];

    setCurrentTab: (tab: Tab) => void;
    setStoryPhase: (phase: StoryPhase) => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    setStructuredStory: (story: StructuredStory) => void;

    setProjectId: (id: string | null) => void;
    setProjectTitle: (title: string) => void;
    setSyncStatus: (status: SyncStatus) => void;

    createNewProject: (userId: string) => Promise<string>;
    loadProject: (projectId: string) => Promise<void>;
    saveProject: () => Promise<void>;
    triggerAutoSave: () => void;

    setIANodes: (nodes: Node[]) => void;
    setIAEdges: (edges: Edge[]) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addIANode: (node: Node) => void;
    resetIA: () => void;

    setUserflowNodes: (nodes: Node[]) => void;
    setUserflowEdges: (edges: Edge[]) => void;
    onUserflowNodesChange: OnNodesChange;
    onUserflowEdgesChange: OnEdgesChange;
    addUserflowNode: (node: Node) => void;
    resetUserflow: () => void;

    addNotification: (message: string, type?: Notification['type']) => void;

    analyzeSuggestions: () => void;

    runIASync: () => void;
    runUserflowSync: () => void;

    updateIANode: (id: string, data: any) => void;
    updateUserflowNode: (id: string, data: any) => void;

    deleteIANodes: (ids: string[]) => void;
    deleteUserflowNodes: (ids: string[]) => void;

    resetStory: () => void;
}

const debouncedSave = debounce(async (fn: () => Promise<void>) => {
    await fn();
}, 3000);

export const useLayrStore = create<LayrState>()(
    persist(
        (set, get) => ({
            projectId: null,
            projectTitle: 'Untitled Project',
            syncStatus: 'saved',
            lastSaved: null,

            currentTab: 'story',
            storyPhase: 'idealization',
            storyData: '',
            chatHistory: [],
            structuredStory: null,

            notifications: [],
            lastSyncSource: null,
            suggestions: [],

            userPlan: 'free',
            setUserPlan: (plan) => set({ userPlan: plan }),

            iaNodes: [],
            iaEdges: [],

            userflowNodes: [],
            userflowEdges: [],

            setCurrentTab: (tab) => set({ currentTab: tab }),
            setStoryPhase: (phase) => set({ storyPhase: phase }),

            addMessage: (msg) => {
                set((state) => ({
                    chatHistory: [
                        ...state.chatHistory,
                        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }
                    ],
                    syncStatus: 'unsaved'
                }));
                get().triggerAutoSave();
            },

            setStructuredStory: (story) => {
                set({ structuredStory: story, syncStatus: 'unsaved' });
                get().triggerAutoSave();
            },

            setProjectId: (id) => set({ projectId: id }),

            setProjectTitle: (title) => {
                set({ projectTitle: title, syncStatus: 'unsaved' });
                const { projectId } = get();
                if (projectId) {
                    projectService.updateProjectTitle(projectId, title).catch(console.error);
                }
            },

            setSyncStatus: (status) => set({ syncStatus: status }),

            createNewProject: async (userId) => {
                const check = await userService.checkProjectLimit(userId);
                if (!check.allowed) throw new Error('Limit reached');

                const id = await projectService.createProject(userId);

                set({
                    projectId: id,
                    iaNodes: [],
                    iaEdges: [],
                    userflowNodes: [],
                    userflowEdges: [],
                    chatHistory: [],
                    structuredStory: null,
                    suggestions: []
                });

                return id;
            },

            loadProject: async (projectId) => {
                const project = await projectService.getProject(projectId);
                if (!project) return;

                set({
                    projectId: projectId,
                    projectTitle: project.title,
                    structuredStory: project.data.story,
                    iaNodes: project.data.ia.nodes || [],
                    iaEdges: project.data.ia.edges || [],
                    userflowNodes: project.data.userflow.nodes || [],
                    userflowEdges: project.data.userflow.edges || []
                });

                get().analyzeSuggestions();
            },

            saveProject: async () => {
                const state = get();
                if (!state.projectId) return;

                await projectService.saveProject(state.projectId, {
                    story: state.structuredStory,
                    ia: { nodes: state.iaNodes, edges: state.iaEdges },
                    userflow: { nodes: state.userflowNodes, edges: state.userflowEdges }
                });

                set({ syncStatus: 'saved', lastSaved: Date.now() });
            },

            triggerAutoSave: () => {
                const { projectId } = get();
                if (projectId) {
                    set({ syncStatus: 'unsaved' });
                    debouncedSave(() => get().saveProject());
                }
            },

            analyzeSuggestions: () => {
                const state = get();

                const suggestions = analyzeProject(
                    state.structuredStory,
                    state.iaNodes,
                    state.iaEdges,
                    state.userflowNodes,
                    state.userflowEdges,
                    state.userPlan
                );

                set({ suggestions });
            },

            setIANodes: (nodes) => {
                set({ iaNodes: nodes });
                get().triggerAutoSave();
            },

            setIAEdges: (edges) => {
                set({ iaEdges: edges });
                get().triggerAutoSave();
            },

            onNodesChange: (changes) => {
                set({
                    iaNodes: applyNodeChanges(changes, get().iaNodes)
                });
                get().triggerAutoSave();
            },

            onEdgesChange: (changes) => {
                set({
                    iaEdges: applyEdgeChanges(changes, get().iaEdges)
                });
                get().triggerAutoSave();
            },

            addIANode: (node) => {
                set((state) => ({ iaNodes: [...state.iaNodes, node] }));
                get().triggerAutoSave();
            },

            resetIA: () => set({ iaNodes: [], iaEdges: [] }),

            setUserflowNodes: (nodes) => {
                set({ userflowNodes: nodes });
                get().triggerAutoSave();
            },

            setUserflowEdges: (edges) => {
                set({ userflowEdges: edges });
                get().triggerAutoSave();
            },

            onUserflowNodesChange: (changes) => {
                set({
                    userflowNodes: applyNodeChanges(changes, get().userflowNodes)
                });
                get().triggerAutoSave();
            },

            onUserflowEdgesChange: (changes) => {
                set({
                    userflowEdges: applyEdgeChanges(changes, get().userflowEdges)
                });
                get().triggerAutoSave();
            },

            addUserflowNode: (node) => {
                set((state) => ({
                    userflowNodes: [...state.userflowNodes, node]
                }));
                get().triggerAutoSave();
            },

            resetUserflow: () => set({ userflowNodes: [], userflowEdges: [] }),

            addNotification: (message, type = 'info') =>
                set((state) => ({
                    notifications: [
                        ...state.notifications,
                        { id: crypto.randomUUID(), message, type, timestamp: Date.now() }
                    ]
                })),

            runIASync: () => {
                const state = get();
                if (!state.structuredStory) return;

                const updated = syncIAtoStory(state.iaNodes, state.structuredStory);
                if (updated) {
                    set({ structuredStory: updated });
                }
            },

            runUserflowSync: () => {
                // Disabled to prevent "Steps" from contaminating IA architecture
                // IA and Userflow are now decoupled to maintain structural purity
            },

            updateIANode: (id, data) => {
                set((state) => ({
                    iaNodes: state.iaNodes.map((node) =>
                        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
                    )
                }));
                get().triggerAutoSave();
            },

            updateUserflowNode: (id, data) => {
                set((state) => ({
                    userflowNodes: state.userflowNodes.map((node) =>
                        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
                    )
                }));
                get().triggerAutoSave();
            },

            deleteIANodes: (ids) => {
                set((state) => ({
                    iaNodes: state.iaNodes.filter((node) => !ids.includes(node.id)),
                    iaEdges: state.iaEdges.filter((edge) => !ids.includes(edge.source) && !ids.includes(edge.target))
                }));
                get().triggerAutoSave();
            },

            deleteUserflowNodes: (ids) => {
                set((state) => ({
                    userflowNodes: state.userflowNodes.filter((node) => !ids.includes(node.id)),
                    userflowEdges: state.userflowEdges.filter((edge) => !ids.includes(edge.source) && !ids.includes(edge.target))
                }));
                get().triggerAutoSave();
            },

            resetStory: () => {
                set({
                    chatHistory: [],
                    storyPhase: 'idealization',
                    structuredStory: null,
                    iaNodes: [],
                    iaEdges: [],
                    userflowNodes: [],
                    userflowEdges: []
                });
                get().triggerAutoSave();
            }
        }),
        {
            name: 'layr-storage'
        }
    )
);