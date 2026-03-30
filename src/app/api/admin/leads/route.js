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

// ──── GET /api/admin/leads (List all leads) ────────────────────────────
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
    const estado = searchParams.get("estado");
    const tieneIUL = searchParams.get("tieneIUL");

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const leadsCollection = db.collection("leads");

    // Build filter
    const filter = {};
    if (estado) {
      filter.estado = estado;
    }
    if (tieneIUL) {
      filter.tieneIUL = tieneIUL;
    }

    // Get total count
    const total = await leadsCollection.countDocuments(filter);

    // Get paginated leads
    const leads = await leadsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ──── DELETE /api/admin/leads/:id (Delete lead) ────────────────────────
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

    // Extract leadId from URL
    const pathParts = request.nextUrl.pathname.split("/");
    const leadId = pathParts[pathParts.length - 1];

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const leadsCollection = db.collection("leads");

    const result = await leadsCollection.deleteOne({
      _id: new ObjectId(leadId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/leads error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
