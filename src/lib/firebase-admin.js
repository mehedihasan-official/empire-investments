import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp;
let initError = null;

// Function to parse the private key from environment variable
function parsePrivateKey() {
  let key = process.env.FIREBASE_PRIVATE_KEY;

  if (!key) {
    throw new Error("FIREBASE_PRIVATE_KEY is not set");
  }

  // Log the first few characters to debug (without exposing the full key)
  console.log("Private key starts with:", key.substring(0, 50) + "...");

  // Remove surrounding quotes if present (happens when pasted into Vercel UI)
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
    console.log("Removed surrounding quotes");
  }

  // Check if the key already has actual newlines (from .env.local)
  if (key.includes('\n')) {
    console.log("Key already has actual newlines");
    return key;
  }

  // If no actual newlines, try replacing escaped newlines
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, "\n");
    console.log("Replaced escaped newlines with actual newlines");
  }

  console.log("After processing, key starts with:", key.substring(0, 50) + "...");

  // Ensure the key starts and ends with the correct PEM headers
  if (!key.includes("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
    console.error("Invalid private key format - missing PEM headers");
    throw new Error("Invalid private key format: missing PEM headers");
  }

  console.log("Private key format appears valid");
  return key;
}

// Initialize Firebase Admin once
try {
  if (getApps().length === 0) {
    const privateKey = parsePrivateKey();

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("✓ Firebase Admin initialized successfully");
  } else {
    adminApp = getApps()[0];
    console.log("✓ Firebase Admin already initialized, reusing instance");
  }
} catch (error) {
  initError = error;
  console.error("✗ Firebase Admin initialization failed:", {
    message: error.message,
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
  });
}

// Verify ID token
export async function verifyToken(token) {
  if (initError) {
    console.error("Cannot verify token: Firebase Admin failed to initialize", initError.message);
    return null;
  }

  if (!adminApp) {
    console.error("Cannot verify token: adminApp is not initialized");
    return null;
  }

  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", {
      message: error.message,
      code: error.code,
      tokenLength: token?.length,
    });
    return null;
  }
}

// Export the admin app instance if needed for other operations
export { adminApp };
