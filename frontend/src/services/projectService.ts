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
    createdAt?: Timestamp;
    updatedAt?: object;
    data: {
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

const PROJECTS_COLLECTION = 'projects';

export const projectService = {
    // Create new project
    async createProject(userId: string, title: string = 'Untitled Project'): Promise<string> {
        try {
            console.log("createProject called for user:", userId);

            const projectData = {
                userId,
                title,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                data: {
                    story: null,
                    ia: { nodes: [], edges: [] },
                    userflow: { nodes: [], edges: [] }
                }
            };

            console.log("DB Instance:", db);
            console.log("DB Type:", db ? typeof db : "null/undefined");

            if (!db || Object.keys(db).length === 0) {
                console.error("DB IS EMPTY/INVALID!");
                throw new Error("Firestore DB instance is invalid/empty.");
            }

            const colRef = collection(db, PROJECTS_COLLECTION);
            console.log("Collection Ref:", colRef);

            const docRef = await addDoc(colRef, projectData);
            console.log("Project created with ID:", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    // Save/Update full project data
    async saveProject(projectId: string, data: ProjectData['data']): Promise<void> {
        try {
            const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
            await updateDoc(projectRef, {
                data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving project:', error);
            throw error;
        }
    },

    // Update just the title
    async updateProjectTitle(projectId: string, title: string): Promise<void> {
        try {
            const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
            await updateDoc(projectRef, {
                title,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating project title:', error);
            throw error;
        }
    },

    // Load full project
    async getProject(projectId: string): Promise<ProjectData | null> {
        try {
            const docRef = doc(db, PROJECTS_COLLECTION, projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as ProjectData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting project:', error);
            throw error;
        }
    },

    // List user projects
    async getUserProjects(userId: string): Promise<ProjectData[]> {
        if (!userId) {
            console.warn("getUserProjects called with empty userId");
            return [];
        }
        try {
            const q = query(
                collection(db, PROJECTS_COLLECTION),
                where("userId", "==", userId)
            );

            const querySnapshot = await getDocs(q);
            const projects: ProjectData[] = [];

            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() } as ProjectData);
            });

            // Sort client-side for simplicity if index not ready
            return projects.sort((a, b) => {
                const tA = (a.updatedAt as Timestamp)?.toMillis?.() || 0;
                const tB = (b.updatedAt as Timestamp)?.toMillis?.() || 0;
                return tB - tA; // desc
            });
        } catch (error) {
            console.error('Error listing projects:', error);
            throw error;
        }
    },

    // Delete project
    async deleteProject(projectId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
};
