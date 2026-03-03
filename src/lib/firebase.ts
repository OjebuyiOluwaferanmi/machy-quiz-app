import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Load firebase configuration from Vite environment variables to avoid
// committing API keys to source control. Create a local .env with
// VITE_FIREBASE_* variables (see .env.example).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.warn("VITE_FIREBASE_API_KEY is not set — Firebase may not initialize correctly.");
}

// Debug: show which Firebase config loaded
console.log("🔥 Firebase initialized with projectId:", firebaseConfig.projectId);
if (!firebaseConfig.projectId) {
  console.error("❌ Firebase config is NOT loaded from .env.local — env vars are missing or dev server wasn't restarted!");
}

const app = initializeApp(firebaseConfig as any);

// Export Firestore instance for use across the app
export const db = getFirestore(app);
