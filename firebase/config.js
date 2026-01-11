// Firebase Configuration for Namma Canteen
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (loaded from environment variables)
// Fallback values for local development - replace with your own or use .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeIURKXl5Mvh9QAyv_TkEJCCT4laarbMQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "namma-canteen-54ed2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "namma-canteen-54ed2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "namma-canteen-54ed2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "952567823718",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:952567823718:web:4b3db129b5c18858b31ca7"
};

// Log warning in development if env vars are not set
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn("⚠️ Firebase: Using fallback config. Set VITE_FIREBASE_* env vars in .env file for production.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore (for future use)
export const db = getFirestore(app);

export default app;
