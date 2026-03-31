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

  // Remove surrounding quotes if present (happens when pasted into Vercel UI)
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  // Handle different newline formats
  // 1) If the env var uses actual newline characters (multiline value), keep as-is
  if (key.includes('\n') && !key.includes('\\n')) {
    return key;
  }

  // 2) If the env var has escaped newlines (literal backslash+n), convert them
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }

  // 3) If the env var has escaped backslash sequences (double slash), normalize them
  if (key.includes('\\\\n')) {
    key = key.replace(/\\\\n/g, '\n');
  }

  // If no newlines at all, it might be a single line - try to format it
  if (!key.includes('\n') && key.includes('-----BEGIN PRIVATE KEY-----')) {
    // This might be a malformed key - try to add newlines
    key = key.replace(/-----BEGIN PRIVATE KEY-----/, '-----BEGIN PRIVATE KEY-----\n');
    key = key.replace(/-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----\n');
    // Add newlines every ~64 characters for base64 content
    const lines = key.split('\n');
    const formattedLines = lines.map(line => {
      if (line.length > 64 && !line.includes('-----')) {
        return line.match(/.{1,64}/g).join('\n');
      }
      return line;
    });
    key = formattedLines.join('\n');
  }

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
