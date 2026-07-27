import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  url:      { type: String, required: true },
  publicId: { type: String, default: '' },
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Product name is required'],
      trim:      true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type:     String,
      required: [true, 'Product description is required'],
      trim:     true,
    },
    price: {
      type:     Number,
      required: [true, 'Product price is required'],
      min:      [0, 'Price cannot be negative'],
    },
    discount: {
      type:    Number,
      default: 0,
      min:     [0, 'Discount cannot be negative'],
      max:     [100, 'Discount cannot exceed 100%'],
    },
    discountedPrice: {
      type: Number,
    },
    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type:    String,
      trim:    true,
      default: '',
    },
    stock: {
      type:     Number,
      required: [true, 'Stock is required'],
      min:      [0, 'Stock cannot be negative'],
      default:  0,
    },
    images:  [imageSchema],
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },
    reviewCount: {
      type:    Number,
      default: 0,
    },
    soldCount: {
      type:    Number,
      default: 0,
    },
    slug: {
      type:      String,
      unique:    true,
      lowercase: true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    isFeatured: {
      type:    Boolean,
      default: false,
    },
    tags: [{ type: String, lowercase: true }],
  },
  { timestamps: true }
)

// Indexes for search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ isActive: 1 })
productSchema.index({ isFeatured: 1 })

// Compute discounted price before saving
productSchema.pre('save', function (next) {
  if (this.isModified('price') || this.isModified('discount')) {
    this.discountedPrice = this.discount > 0
      ? parseFloat((this.price - (this.price * this.discount) / 100).toFixed(2))
      : this.price
  }

  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  next()
})

const Product = mongoose.model('Product', productSchema)
export default Product
