import { verifyToken } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
