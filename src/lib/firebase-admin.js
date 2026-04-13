import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ── Normalizes and validates a Firebase private key for use with firebase-admin
function normalizePrivateKey(rawKey) {
  let key = String(rawKey || "").trim();

  // 1. Strip surrounding quotes Vercel or .env entries sometimes wrap in literal quotes
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  // 2. Convert escaped \n into real newline chars
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  // 3. Normalize line endings to LF
  key = key.replace(/\r/g, "");

  // 4. Trim again (cleanup trailing whitespace after normalization)
  key = key.trim();

  const hasBegin = key.includes("-----BEGIN PRIVATE KEY-----");
  const hasEnd = key.includes("-----END PRIVATE KEY-----");

  if (!hasBegin || !hasEnd) {
    throw new Error(
      `FIREBASE_PRIVATE_KEY PEM format invalid. hasBegin=${hasBegin} hasEnd=${hasEnd} length=${key.length}`
    );
  }

  return key;
}

// ── Lazy initialization — runs only when first request comes in ───────────
// NOT at module load time, so build-time missing env vars won't break it
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      `[firebase-admin] Missing Firebase Admin env vars. projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!rawKey}`
    );
  }

  const privateKey = normalizePrivateKey(rawKey);
  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  console.log("[firebase-admin] initialized", {
    projectId,
    clientEmail: !!clientEmail,
  });

  return app;
}

// ── Verify a Firebase ID token ────────────────────────────────────────────
export async function verifyToken(token) {
  if (!token) {
    console.warn("[firebase-admin] verifyToken: empty token");
    return null;
  }

  try {
    const app = getAdminApp();
    const decodedToken = await getAuth(app).verifyIdToken(token);
    
    // Ensure the token has a uid
    if (!decodedToken || !decodedToken.uid) {
      console.warn("[firebase-admin] verifyToken: decoded token missing uid", {
        hasToken: !!decodedToken,
        keys: decodedToken ? Object.keys(decodedToken) : [],
      });
      return null;
    }
    
    return decodedToken;
  } catch (err) {
    console.error("[firebase-admin] verifyToken error:", err.message);
    return null;
  }
}

// ── Extract Bearer token from request and verify ──────────────────────────
export async function verifyRequest(request) {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    console.warn("[firebase-admin] verifyRequest: missing or invalid Bearer token header");
    return null;
  }

  const token = header.replace("Bearer ", "").trim();
  if (!token) {
    console.warn("[firebase-admin] verifyRequest: Bearer token is empty");
    return null;
  }

  return verifyToken(token);
}