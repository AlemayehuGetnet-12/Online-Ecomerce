import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 6,
      select:    false,
    },
    role: {
      type:    String,
      enum:    ['customer', 'admin'],
      default: 'customer',
    },
    phone: {
      type:    String,
      trim:    true,
      default: '',
    },
    avatar: {
      type:    String,
      default: '',
    },
    address: {
      street:  { type: String, default: '' },
      city:    { type: String, default: '' },
      region:  { type: String, default: '' },
      country: { type: String, default: 'Ethiopia' },
      zipCode: { type: String, default: '' },
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Product',
      },
    ],
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
