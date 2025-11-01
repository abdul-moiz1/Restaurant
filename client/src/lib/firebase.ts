import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2MAEUXX-R9eQKEMLUophsyC-_OniuThc",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newrestaurant-25f8c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newrestaurant-25f8c",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newrestaurant-25f8c.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "869805725923",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:869805725923:web:a7a7646d5e26ed27e80dd6",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

//GitHub Attached
