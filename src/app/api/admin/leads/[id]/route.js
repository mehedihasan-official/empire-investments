import { verifyToken } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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

export async function DELETE(request, { params }) {
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

    const leadId = Array.isArray(params.id) ? params.id[0] : params.id;
    const normalizedLeadId = typeof leadId === "string" ? leadId.trim() : "";
    if (!ObjectId.isValid(normalizedLeadId)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const leadsCollection = db.collection("leads");

    const result = await leadsCollection.deleteOne({ _id: new ObjectId(normalizedLeadId) });

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
    console.error("DELETE /api/admin/leads/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
