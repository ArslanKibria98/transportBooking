import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/transportbooking";

const isDev = process.env.NODE_ENV !== "production";

let cached = globalThis.mongooseConn;
if (!cached) {
  cached = globalThis.mongooseConn = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = (async () => {
      // Log connection attempt (hide credentials)
      const safeUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
      console.log("[MongoDB] Connecting to", safeUri);
      console.log("[MongoDB] Database:", process.env.MONGODB_DB || "transportbooking");
      
      // Check if MONGODB_URI is set
      if (!MONGODB_URI || MONGODB_URI === "mongodb://127.0.0.1:27017/transportbooking") {
        console.warn("[MongoDB] ⚠️  MONGODB_URI not set or using default. Please set MONGODB_URI environment variable.");
      }
      
      try {
        const conn = await mongoose.connect(MONGODB_URI, {
          dbName: process.env.MONGODB_DB || "transportbooking",
          serverSelectionTimeoutMS: 10000, // 10 seconds timeout
          socketTimeoutMS: 45000, // 45 seconds socket timeout
          connectTimeoutMS: 10000, // 10 seconds connection timeout
          maxPoolSize: 10, // Maintain up to 10 socket connections
          retryWrites: true,
          w: 'majority',
        });
        console.log("[MongoDB] ✅ Connected successfully");
        console.log("[MongoDB] Connection state:", mongoose.connection.readyState);
        return conn;
      } catch (err: any) {
        console.error("[MongoDB] ❌ Connection error:", err?.message || err);
        console.error("[MongoDB] Error name:", err?.name);
        console.error("[MongoDB] Error code:", err?.code);
        
        // Provide helpful error messages
        if (err?.name === "MongoServerSelectionError") {
          console.error("[MongoDB] ⚠️  Cannot reach MongoDB server. Check:");
          console.error("   1. MongoDB Atlas Network Access - Add Railway IP (0.0.0.0/0 for all)");
          console.error("   2. MONGODB_URI is correct in Railway environment variables");
          console.error("   3. MongoDB cluster is running");
        } else if (err?.name === "MongoParseError") {
          console.error("[MongoDB] ⚠️  Invalid MONGODB_URI format. Check connection string.");
        } else if (err?.name === "MongoAuthenticationError") {
          console.error("[MongoDB] ⚠️  Authentication failed. Check username/password in MONGODB_URI");
        }
        
        throw err;
      }
    })();
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

