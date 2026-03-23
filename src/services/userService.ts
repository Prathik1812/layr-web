import { db } from './firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getCountFromServer
} from 'firebase/firestore';

export type UserPlan = 'free' | 'pro';

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    plan: UserPlan;
    projectLimit: number;
    subscriptionId?: string | null;
    subscriptionStatus: 'active' | 'cancelled' | 'past_due' | 'trialing' | null;
    createdAt?: any;
    updatedAt?: any;
}

export const PLAN_LIMITS = {
    free: {
        maxProjects: 2,
        aiSuggestions: 'basic',
        canExport: false
    },
    pro: {
        maxProjects: 9999, // Effectively infinite
        aiSuggestions: 'advanced',
        canExport: true
    }
};

const USERS_COLLECTION = 'users';
const PROJECTS_COLLECTION = 'projects';

export const userService = {
    // Create or update user profile on login
    async syncUser(uid: string, email: string, displayName?: string, photoURL?: string): Promise<UserProfile> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return { ...snapshot.data(), uid } as UserProfile;
        } else {
            // Create new user (Default to FREE)
            const newUser: UserProfile = {
                uid,
                email,
                displayName,
                photoURL,
                plan: 'free',
                projectLimit: PLAN_LIMITS.free.maxProjects,
                subscriptionId: null,
                subscriptionStatus: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            await setDoc(userRef, newUser);
            return newUser;
        }
    },

    async getUser(uid: string): Promise<UserProfile | null> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
            return { ...snapshot.data(), uid } as UserProfile;
        }
        return null;
    },

    async subscribeUser(uid: string, plan: UserPlan, status: UserProfile['subscriptionStatus'] = 'active', subscriptionId: string = 'sim_sub_id'): Promise<void> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, {
            plan,
            projectLimit: PLAN_LIMITS[plan].maxProjects,
            subscriptionStatus: status,
            subscriptionId: status === 'active' ? subscriptionId : null,
            updatedAt: serverTimestamp()
        });
    },

    // Check if user can create a new project
    async checkProjectLimit(uid: string): Promise<{ allowed: boolean; limit: number; current: number; plan: UserPlan }> {
        const user = await this.getUser(uid);
        if (!user) throw new Error("User not found");

        const plan = user.plan || 'free';
        // Use stored limit, or fallback to map
        const limit = user.projectLimit ?? PLAN_LIMITS[plan].maxProjects;

        if (limit >= 9999) {
            return { allowed: true, limit, current: 0, plan };
        }

        // Count current projects
        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where("userId", "==", uid)
        );
        const snapshot = await getCountFromServer(q);
        const current = snapshot.data().count;

        return {
            allowed: current < limit,
            limit,
            current,
            plan
        };
    }
};
