import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    subject: {
      type:   String,
      trim:   true,
      default: 'other',
    },
    message: {
      type:     String,
      required: [true, 'Message is required'],
      trim:     true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    isRead: {
      type:    Boolean,
      default: false,
    },
    // Optional: link to user if logged in
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      default:  null,
    },
  },
  { timestamps: true }
)

// Index for admin filtering
contactMessageSchema.index({ isRead: 1, createdAt: -1 })
contactMessageSchema.index({ createdAt: -1 })

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
export default ContactMessage