import clientPromise from "@/lib/mongodb";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
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

// ──── Verify Token and Check Admin ──────────────────────────────────────
async function verifyAdminToken(token) {
  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    
    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");
    
    const user = await usersCollection.findOne({ uid: decodedToken.uid });
    
    if (!user || user.role !== "admin") {
      return null;
    }
    
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// ──── GET /api/users (List all users) ──────────────────────────────────
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
    const decodedToken = await verifyAdminToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get query params for pagination and filtering
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    // Build filter
    const filter = {};
    if (role && role !== "all") {
      filter.role = role;
    }

    // Get total count
    const total = await usersCollection.countDocuments(filter);

    // Get paginated users
    const users = await usersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ──── PUT /api/users/:id (Update user) ─────────────────────────────────
export async function PUT(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await verifyAdminToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Extract userId from URL
    const pathParts = request.nextUrl.pathname.split("/");
    const userId = pathParts[pathParts.length - 1];

    const body = await request.json();
    const { role } = body;

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ──── DELETE /api/users/:id (Delete user) ────────────────────────────────
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await verifyAdminToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Extract userId from URL
    const pathParts = request.nextUrl.pathname.split("/");
    const userId = pathParts[pathParts.length - 1];

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
