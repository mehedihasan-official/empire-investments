import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// ──── Firebase Configuration ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ──── Validate ENV (optional but recommended) ───────────────────────────────
if (!firebaseConfig.apiKey) {
  console.warn("⚠️ Firebase env variables are missing!");
}

// ──── Initialize Firebase (Prevent duplicate init) ──────────────────────────
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ──── Initialize Auth ───────────────────────────────────────────────────────
const auth = getAuth(app);

// ──── Optional: Use Emulator in Development ────────────────────────────────
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development"
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
  } catch (error) {
    // ignore if already connected
  }
}

export { app, auth };