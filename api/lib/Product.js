import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    description:     { type: String, required: true },
    price:           { type: Number, required: true, min: 0 },
    discount:        { type: Number, default: 0, min: 0, max: 100 },
    discountedPrice: { type: Number, min: 0 },
    category:        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand:           { type: String, trim: true },
    stock:           { type: Number, default: 0, min: 0 },
    images:          [{ url: String, publicId: String }],
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:     { type: Number, default: 0 },
    soldCount:       { type: Number, default: 0 },
    slug:            { type: String, unique: true },
    tags:            [String],
    isFeatured:      { type: Boolean, default: false },
    isActive:        { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)