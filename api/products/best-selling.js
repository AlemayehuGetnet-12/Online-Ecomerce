import { connectDB } from '../lib/db.js'
import Product from '../lib/Product.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await connectDB()
    const products = await Product.find({ isActive: true, soldCount: { $gt: 0 } })
      .sort({ soldCount: -1 })
      .limit(10)
      .lean()

    return res.status(200).json({ success: true, products })
  } catch (error) {
    console.error('Best selling error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}