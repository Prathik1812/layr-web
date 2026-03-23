import { db } from './firebase';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

export interface ProjectData {
    id?: string;
    userId: string;
    title: string;
    createdAt?: string; // Changed from Timestamp to string for JSON compatibility
    updatedAt?: string;
    data: string | { // Backend stores as String (JSON)
        story: any;
        ia: {
            nodes: any[];
            edges: any[];
        };
        userflow: {
            nodes: any[];
            edges: any[];
        };
    };
}

export const projectService = {
    // Create new project
    async createProject(userId: string, title: string = 'Untitled Project'): Promise<string> {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    title,
                    data: JSON.stringify({
                        story: null,
                        ia: { nodes: [], edges: [] },
                        userflow: { nodes: [], edges: [] }
                    })
                })
            });
            const project = await response.json();
            return project.id.toString();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    // Save/Update full project data
    async saveProject(projectId: string, data: any): Promise<void> {
        try {
            const currentProject = await this.getProject(projectId);
            if (!currentProject) throw new Error("Project not found");

            await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: currentProject.title,
                    data: typeof data === 'string' ? data : JSON.stringify(data)
                })
            });
        } catch (error) {
            console.error('Error saving project:', error);
            throw error;
        }
    },

    // Update just the title
    async updateProjectTitle(projectId: string, title: string): Promise<void> {
        try {
            const currentProject = await this.getProject(projectId);
            if (!currentProject) throw new Error("Project not found");

            await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    data: typeof currentProject.data === 'string' ? currentProject.data : JSON.stringify(currentProject.data)
                })
            });
        } catch (error) {
            console.error('Error updating project title:', error);
            throw error;
        }
    },

    // Load full project
    async getProject(projectId: string): Promise<ProjectData | null> {
        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) return null;
            const project = await response.json();
            
            // Parse data if it's a string
            if (typeof project.data === 'string') {
                try {
                    project.data = JSON.parse(project.data);
                } catch (e) {
                    console.error("Error parsing project data", e);
                }
            }
            return project as ProjectData;
        } catch (error) {
            console.error('Error getting project:', error);
            throw error;
        }
    },

    // List user projects
    async getUserProjects(userId: string): Promise<ProjectData[]> {
        if (!userId) return [];
        try {
            const response = await fetch(`/api/projects?userId=${userId}`);
            const projects = await response.json();
            
            return projects.map((p: any) => {
                if (typeof p.data === 'string') {
                    try {
                        p.data = JSON.parse(p.data);
                    } catch (e) {}
                }
                return p;
            });
        } catch (error) {
            console.error('Error listing projects:', error);
            throw error;
        }
    },

    // Delete project
    async deleteProject(projectId: string): Promise<void> {
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
};

