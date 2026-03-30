import clientPromise from "@/lib/mongodb";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";

let adminApp;
try {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

async function verifyToken(token) {
  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid: decodedToken.uid });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
