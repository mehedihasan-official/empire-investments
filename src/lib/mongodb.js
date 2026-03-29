import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "❌ Missing MONGODB_URI in environment variables.\n" +
      "Copy .env.local.example to .env.local and fill in your MongoDB connection string."
  );
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, reuse the MongoClient across HMR reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a fresh client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
