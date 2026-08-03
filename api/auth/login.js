import { connectDB } from '../lib/db.js'
import User from '../lib/User.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      })
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone,
        avatar:  user.avatar,
        role:    user.role,
        address: user.address,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}