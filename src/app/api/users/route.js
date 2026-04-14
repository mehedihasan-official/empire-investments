import { verifyToken } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ──── Verify Token and Check Admin ──────────────────────────────────────
async function verifyAdminToken(token) {
  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return null;
    }

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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const role = searchParams.get("role");

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    const filter = {};
    if (role && role !== "all") {
      filter.role = role;
    }

    const total = await usersCollection.countDocuments(filter);
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
