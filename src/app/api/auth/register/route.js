import { verifyToken } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
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

    const body = await request.json();
    const { displayName, photoURL } = body;

    const client = await clientPromise();
    const db = client.db("empire_investments");
    const usersCollection = db.collection("users");

    let user = await usersCollection.findOne({ uid: decodedToken.uid });

    if (user) {
      await usersCollection.updateOne(
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
      const newUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: displayName || decodedToken.name || "",
        photoURL: photoURL || decodedToken.picture || "",
        role: "user",
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
