// Firebase Configuration for Namma Canteen
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeIURKXl5Mvh9QAyv_TkEJCCT4laarbMQ",
  authDomain: "namma-canteen-54ed2.firebaseapp.com",
  projectId: "namma-canteen-54ed2",
  storageBucket: "namma-canteen-54ed2.firebasestorage.app",
  messagingSenderId: "952567823718",
  appId: "1:952567823718:web:4b3db129b5c18858b31ca7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore (for future use)
export const db = getFirestore(app);

export default app;
