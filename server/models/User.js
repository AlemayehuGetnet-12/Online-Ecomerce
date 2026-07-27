import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  street:   { type: String, trim: true },
  city:     { type: String, trim: true },
  region:   { type: String, trim: true },
  country:  { type: String, trim: true, default: 'Ethiopia' },
  zipCode:  { type: String, trim: true },
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },
    phone: {
      type:  String,
      trim:  true,
    },
    avatar: {
      type:    String,
      default: '',
    },
    address: addressSchema,
    role: {
      type:    String,
      enum:    ['customer', 'admin'],
      default: 'customer',
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Product',
      },
    ],
    resetPasswordToken:   String,
    resetPasswordExpire:  Date,
  },
  { timestamps: true }
)

// Indexes — email index is already created by unique:true above, only add role
userSchema.index({ role: 1 })

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
