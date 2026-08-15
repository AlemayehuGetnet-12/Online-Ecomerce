import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI

    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env')
    }

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