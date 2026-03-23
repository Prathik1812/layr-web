import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { userService, type UserProfile } from '../services/userService';
import { useLayrStore } from '../store/useLayrStore';

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const { setUserPlan } = useLayrStore();

    useEffect(() => {
        // Development Mock Auth Bypass
        if (import.meta.env.DEV && localStorage.getItem('MOCK_AUTH') === 'true') {
            const mockProfile: UserProfile = {
                uid: 'mock-dev-123',
                email: 'dev@layr.ai',
                displayName: 'Dev Audit User',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev',
                plan: 'pro',
                projectLimit: 9999,
                subscriptionStatus: 'active'
            };
            setUser(mockProfile);
            setFirebaseUser({ 
                uid: 'mock-dev-123', 
                email: 'dev@layr.ai',
                displayName: 'Dev Audit User',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev'
            } as FirebaseUser);
            setUserPlan('pro');
            setLoading(false);
            return;
        }

        let unsubscribe: () => void = () => { };

        try {
            unsubscribe = onAuthStateChanged(auth, async (currUser) => {
                setFirebaseUser(currUser);
                if (currUser) {
                    try {
                        const profile = await userService.syncUser(
                            currUser.uid,
                            currUser.email || '',
                            currUser.displayName || '',
                            currUser.photoURL || ''
                        );
                        setUser(profile);
                        setUserPlan(profile.plan);
                    } catch (error) {
                        console.error("Failed to sync user profile", error);
                    }
                } else {
                    setUser(null);
                    setUserPlan('free');
                }
                setLoading(false);
            });
        } catch (e) {
            console.warn("Auth initialization failed (likely missing config). defaulting to Guest mode.");
            setUser(null);
            setUserPlan('free');
            setLoading(false);
        }

        return () => unsubscribe();
    }, [setUserPlan]);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserPlan('free');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const refreshUser = async () => {
        if (firebaseUser) {
            const profile = await userService.getUser(firebaseUser.uid);
            if (profile) {
                setUser(profile);
                setUserPlan(profile.plan);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, loginWithGoogle, logout, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
