import { verifyToken } from "@/lib/firebase-admin";
import clientPromise from "@/lib/mongodb";

export class AdminAuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

export async function getAdminContext(request) {
  const authHeader =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const decodedToken = await verifyToken(token);

  if (!decodedToken?.uid) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  const client = await clientPromise();
  const db = client.db("empire_investments");
  const usersCollection = db.collection("users");
  const adminUser = await usersCollection.findOne({ uid: decodedToken.uid });

  if (!adminUser || adminUser.role !== "admin") {
    throw new AdminAuthError("Admin access required", 403);
  }

  return {
    client,
    db,
    decodedToken,
    adminUser,
    usersCollection,
  };
}
