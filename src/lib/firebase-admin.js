import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ── Lazy initialization — runs only when first request comes in ───────────
// NOT at module load time, so build-time missing env vars won't break it
function getAdminApp() {
  // Return existing app if already initialized
  if (getApps().length > 0) return getApps()[0];

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      `Firebase Admin env vars missing: projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!rawKey}`
    );
  }

  // Handle all private key formats Vercel might produce:
  let privateKey = rawKey;

  // 1. Strip surrounding quotes Vercel sometimes wraps around the value
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  // 2. Convert escaped \n to real newlines (most common Vercel issue)
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  // 3. Verify the key looks valid before trying to use it
  if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("FIREBASE_PRIVATE_KEY does not contain expected PEM header. Check Vercel env var format.");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

// ── Verify a Firebase ID token ────────────────────────────────────────────
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const app = getAdminApp();
    return await getAuth(app).verifyIdToken(token);
  } catch (err) {
    console.error("[firebase-admin] verifyToken error:", err.message);
    return null;
  }
}

// ── Extract Bearer token from request and verify ──────────────────────────
export async function verifyRequest(request) {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.replace("Bearer ", "").trim();
  return verifyToken(token);
}