import { connectDB } from '../lib/db.js'
import User from '../lib/User.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' })
    }

    await connectDB()

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' })
    }

    return res.status(200).json({
      success: true,
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        avatar:   user.avatar,
        role:     user.role,
        address:  user.address,
        wishlist: user.wishlist,
      },
    })
  } catch (error) {
    console.error('Get me error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}