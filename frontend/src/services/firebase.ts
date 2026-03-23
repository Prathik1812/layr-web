
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * FIREBASE CONFIGURATION
 * 
 * Supports both individual environment variables (Recommended)
 * and legacy Base64 encoded config.
 */

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let isInitialized = false;

const getFirebaseConfig = (): FirebaseOptions => {
    // 1. Try Individual Variables (Standard Vite/Next.js pattern)
    // Debug logging
    console.log("Checking Firebase Config:");
    console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "Found" : "Missing");
    console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID ? "Found" : "Missing");

    // Check for at least API Key and Project ID to consider this valid
    if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
        return {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
            measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
        };
    }

    // 2. Try Base64 Config (Legacy/Single Variable)
    const base64Config = import.meta.env.VITE_FIREBASE_CONFIG_BASE64;
    if (base64Config) {
        try {
            const decodedString = atob(base64Config);
            return JSON.parse(decodedString);
        } catch (e) {
            console.error("Failed to decode VITE_FIREBASE_CONFIG_BASE64", e);
        }
    }

    throw new Error("Missing Firebase Configuration. Check your .env file.");
};

try {
    const firebaseConfig = getFirebaseConfig();

    // Validate critical keys
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("Invalid Firebase Config:", firebaseConfig);
        throw new Error("Invalid Firebase Configuration: Missing apiKey or projectId");
    }

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isInitialized = true;

    console.log("Firebase initialized successfully");

} catch (error) {
    console.error("Firebase Initialization Error:", error);

    // Mock services to prevent immediate crash during dev, but warn loudly
    // This allows the UI to render even if data layer is broken
    app = {} as FirebaseApp;
    db = {} as Firestore;
    // We cast to any to allow mocking without implementing full Auth interface
    auth = { currentUser: null } as any;
}

export { app, db, auth, isInitialized };
