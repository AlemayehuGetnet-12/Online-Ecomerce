import mongoose from 'mongoose'

const connectDB = async () => {
  let uri = process.env.MONGO_URI || ''

  // Debug: show URI being loaded (remove later)
  console.log('🔍 MONGO_URI:', uri)

  // Use in-memory MongoDB if no URI is configured
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

      console.log('⚠️ No Atlas URI found — using in-memory MongoDB')
      console.log('📌 Set MONGO_URI in .env to use MongoDB Atlas')
    } catch (error) {
      console.error('❌ Failed to start in-memory MongoDB:', error.message)
      process.exit(1)
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB Connection Error:')
    console.error(error.message)
    process.exit(1)
  }
}

export default connectDB
