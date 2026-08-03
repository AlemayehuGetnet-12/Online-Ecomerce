import { connectDB } from '../lib/db.js'
import Category from '../lib/Category.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { isActive } = req.query
    const filter = {}
    if (isActive === 'true') filter.isActive = true

    const categories = await Category.find(filter).sort({ name: 1 }).lean()

    return res.status(200).json({ success: true, categories })
  } catch (error) {
    console.error('Categories error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}