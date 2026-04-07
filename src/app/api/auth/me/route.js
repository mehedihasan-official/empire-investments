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
  const client = await clientPromise();
  const db = client.db("empire_investments");
  const usersCollection = db.collection("users");

  const userFields = {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    displayName: data.displayName || decodedToken.name || "",
    photoURL: data.photoURL || decodedToken.picture || "",
    updatedAt: new Date(),
  };

  const result = await usersCollection.findOneAndUpdate(
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

  return result.value;
}

export async function GET(request) {
  try {
    const decodedToken = await verifyRequest(request);
    if (!decodedToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByUid(decodedToken.uid);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decodedToken = await verifyRequest(request);
    if (!decodedToken) {
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
