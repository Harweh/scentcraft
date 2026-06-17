import mongoose from 'mongoose'

// Pull the MongoDB connection string from your .env.local file
const MONGODB_URI = process.env.MONGODB_URI

// Safety check — if someone forgets to add MONGODB_URI to .env.local,
// we throw a clear error instead of a confusing crash
if (!MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to your .env.local file')
}

// This variable caches our connection.
// 'global' is used here because in Next.js (serverless),
// each API call runs in its own scope — but 'global' persists across them.
let cached = global.mongoose

// If there's no cached connection yet, create an empty one
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

// This is the function every API route will call
async function connectDB() {

  // If we already have an active connection, just return it immediately
  // No need to connect again — this is the whole point of caching
  if (cached.conn) {
    return cached.conn
  }

  // If no connection attempt is in progress yet, start one
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      // bufferCommands: false means mongoose won't queue up DB operations
      // if the connection is down — it'll fail immediately instead of hanging
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
  }

  // Wait for the connection to finish, then cache and return it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB