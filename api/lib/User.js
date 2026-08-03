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
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone:    { type: String, trim: true },
    avatar:   { type: String, default: '' },
    address:  addressSchema,
    role:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

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

// Use existing model if already compiled (avoids recompilation in serverless)
export default mongoose.models.User || mongoose.model('User', userSchema)