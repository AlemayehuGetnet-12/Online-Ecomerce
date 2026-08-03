import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    description:  { type: String, trim: true },
    image:        { url: String, publicId: String },
    slug:         { type: String, unique: true },
    productCount:{ type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model('Category', categorySchema)