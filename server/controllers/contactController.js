import ContactMessage from '../models/ContactMessage.js'

// @desc    Submit a contact message (public)
// @route   POST /api/contact
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      })
    }

    const msg = await ContactMessage.create({
      name,
      email,
      subject: subject || 'other',
      message,
      user: req.user?._id || null,
    })

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contactMessage: msg,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead, search } = req.query
    const filter = {}

    if (isRead === 'true') filter.isRead = true
    if (isRead === 'false') filter.isRead = false

    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))
    const total    = await ContactMessage.countDocuments(filter)

    const messages = await ContactMessage.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    const unreadCount = await ContactMessage.countDocuments({ isRead: false })

    res.status(200).json({
      success: true,
      total,
      unreadCount,
      page:  pageNum,
      pages: Math.ceil(total / limitNum),
      messages,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get a single contact message (admin)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getMessage = async (req, res) => {
  try {
    const { id } = req.params
    const msg = await ContactMessage.findById(id).populate('user', 'name email').lean()

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    res.status(200).json({ success: true, contactMessage: msg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Mark a message as read (admin)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const msg = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    res.status(200).json({ success: true, message: 'Message marked as read', contactMessage: msg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a contact message (admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params
    const msg = await ContactMessage.findByIdAndDelete(id)

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    res.status(200).json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}