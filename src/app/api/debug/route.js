// TEMPORARY DEBUG ROUTE — DELETE AFTER FIXING
// Visit: /api/debug to see Firebase Admin status
import { NextResponse } from "next/server";

export async function GET() {
  const results = {
    env: {
      hasProjectId:   !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey:  !!process.env.FIREBASE_PRIVATE_KEY,
      projectId:      process.env.FIREBASE_PROJECT_ID || "MISSING",
      clientEmail:    process.env.FIREBASE_CLIENT_EMAIL || "MISSING",
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 40) || "MISSING",
      privateKeyHasRealNewlines:   process.env.FIREBASE_PRIVATE_KEY?.includes("\n") || false,
      privateKeyHasEscapedNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes("\\n") || false,
      privateKeyHasCRLF:            process.env.FIREBASE_PRIVATE_KEY?.includes("\r") || false,
      privateKeyHasBeginMarker:    process.env.FIREBASE_PRIVATE_KEY?.includes("BEGIN PRIVATE KEY") || false,
      privateKeyHasEndMarker:      process.env.FIREBASE_PRIVATE_KEY?.includes("END PRIVATE KEY") || false,
    },
    adminInit: null,
    tokenTest: null,
  };

  // Test Firebase Admin init
  try {
    const { getApps, initializeApp, cert } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    let app;
    if (getApps().length > 0) {
      app = getApps()[0];
      results.adminInit = "reused existing app";
    } else {
      let key = String(process.env.FIREBASE_PRIVATE_KEY || "").trim();
      // Strip surrounding quotes if present
      if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
      // Replace escaped newlines
      if (key.includes("\\n")) key = key.replace(/\\n/g, "\n");
      // Normalize line endings
      key = key.replace(/\r/g, "").trim();

      app = initializeApp({
        credential: cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  key,
        }),
      });
      results.adminInit = "initialized new app";
    }
    results.tokenTest = "Firebase Admin initialized OK";
  } catch (err) {
    results.adminInit = `FAILED: ${err.message}`;
  }

  return NextResponse.json(results);
}