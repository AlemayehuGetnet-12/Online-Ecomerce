import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Create user — active immediately
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      isActive: true,
    })

    // Generate token so user is logged in right away
    const token = generateToken(user._id)

    res.status(201).json({
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
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
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
    const token = generateToken(user._id)

    res.status(200).json({
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
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    res.status(200).json({
      success: true,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone,
        avatar:  user.avatar,
        role:    user.role,
        address: user.address,
        wishlist: user.wishlist,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Update fields
    if (name)    user.name    = name
    if (phone)   user.phone   = phone
    if (address) user.address = address
    if (avatar)  user.avatar  = avatar

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      })
    }

    const user = await User.findById(req.user.id).select('+password')

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Add to wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findById(req.user.id)

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId)
      await user.save()
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: user.wishlist,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Remove from wishlist
// @route   DELETE /api/auth/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findById(req.user.id)

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId)
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: user.wishlist,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist')

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, role } = req.query
    const filter = {}
    if (status === 'active')   filter.isActive = true
    if (status === 'inactive') filter.isActive = false
    if (role)                  filter.role     = role

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Number(limit))
    const total    = await User.countDocuments(filter)

    const users = await User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({ success: true, total, users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Activate or deactivate a user account (Admin)
// @route   PUT /api/auth/users/:id/status
// @access  Private/Admin
export const setUserStatus = async (req, res) => {
  try {
    const { id }       = req.params
    const { isActive } = req.body

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be true or false' })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Prevent deactivating yourself
    if (id === req.user._id.toString() && !isActive) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' })
    }

    user.isActive = isActive
    await user.save()

    res.status(200).json({
      success: true,
      message: isActive ? `Account activated for ${user.name}` : `Account deactivated for ${user.name}`,
      user: { id: user._id, name: user.name, email: user.email, isActive: user.isActive, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
