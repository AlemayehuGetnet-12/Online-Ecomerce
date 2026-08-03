import mongoose from 'mongoose'

// Cache the connection to avoid reconnecting on every serverless function call
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set')
    }

    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}