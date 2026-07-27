import mongoose from 'mongoose'

const connectDB = async () => {
  let uri = process.env.MONGO_URI || ''

  // ── If no real URI is set, spin up an in-memory MongoDB ──────────────
  const needsMemory =
    !uri ||
    uri.includes('PASTE_YOUR') ||
    uri.includes('<username>') ||
    uri === 'mongodb://localhost:27017/alex-store'

  if (needsMemory) {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      uri = mongod.getUri()
      console.log('⚠️  No Atlas URI found — using in-memory MongoDB (data resets on restart)')
      console.log('📌 To persist data, set MONGO_URI in server/.env to your Atlas connection string')
    } catch (e) {
      console.error('❌ Failed to start in-memory MongoDB:', e.message)
      process.exit(1)
    }
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
