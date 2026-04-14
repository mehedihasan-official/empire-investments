import { verifyRequest } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

async function getUserByUid(uid) {
  const client = await clientPromise();
  const db = client.db("empire_investments");
  const usersCollection = db.collection("users");
  return usersCollection.findOne({ uid });
}

async function upsertUser(decodedToken, data) {
  // Validate decodedToken has required uid
  if (!decodedToken || !decodedToken.uid) {
    throw new Error("Invalid token: missing uid");
  }

  const client = await clientPromise();
  const db = client.db("empire_investments");
  const usersCollection = db.collection("users");

  const userFields = {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    displayName: data?.displayName || decodedToken.name || "",
    photoURL: data?.photoURL || decodedToken.picture || "",
    updatedAt: new Date(),
  };

  await usersCollection.findOneAndUpdate(
    { uid: decodedToken.uid },
    {
      $set: userFields,
      $setOnInsert: {
        role: "user",
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  const user = await usersCollection.findOne({ uid: decodedToken.uid });

  if (!user) {
    throw new Error("Failed to upsert user");
  }

  return user;
}

export async function GET(request) {
  try {
    const decodedToken = await verifyRequest(request);
    if (!decodedToken || !decodedToken.uid) {
      console.warn("[/api/auth/me GET] Invalid or missing token", {
        hasToken: !!decodedToken,
        hasUid: !!decodedToken?.uid,
      });
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByUid(decodedToken.uid);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Ensure user has a role (default to "user" if missing)
    const userWithRole = {
      ...user,
      role: user.role || "user",
    };

    return NextResponse.json({ success: true, user: userWithRole });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const decodedToken = await verifyRequest(request);
    if (!decodedToken || !decodedToken.uid) {
      console.warn("[/api/auth/me POST] Invalid or missing token", {
        hasToken: !!decodedToken,
        hasUid: !!decodedToken?.uid,
      });
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const user = await upsertUser(decodedToken, body);

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("POST /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
