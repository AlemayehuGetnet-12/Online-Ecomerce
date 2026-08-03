import { connectDB } from '../lib/db.js'
import User from '../lib/User.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { name, email, password, phone, address } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      isActive: true,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    })

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Alex Store.',
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
    console.error('Register error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}