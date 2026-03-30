import clientPromise from "@/lib/mongodb";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";

// ──── Initialize Firebase Admin ───────────────────────────────────────────
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

// ──── Verify Firebase Token ────────────────────────────────────────────────
async function verifyToken(token) {
  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// ──── GET /api/auth/me (Get current user) ──────────────────────────────────
export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid: decodedToken.uid });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ──── POST /api/auth/register (Create new user) ────────────────────────────
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, photoURL } = body;

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    // Check if user already exists
    let user = await usersCollection.findOne({ uid: decodedToken.uid });

    if (user) {
      // Update existing user
      const result = await usersCollection.updateOne(
        { uid: decodedToken.uid },
        {
          $set: {
            displayName: displayName || decodedToken.name || "",
            photoURL: photoURL || decodedToken.picture || "",
            updatedAt: new Date(),
          },
        }
      );

      user = await usersCollection.findOne({ uid: decodedToken.uid });
    } else {
      // Create new user
      const newUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: displayName || decodedToken.name || "",
        photoURL: photoURL || decodedToken.picture || "",
        role: "user", // default role
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(newUser);
      user = newUser;
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
