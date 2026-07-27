import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Category name is required'],
      unique:    true,
      trim:      true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type:  String,
      trim:  true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    image: {
      url:       { type: String, default: '' },
      publicId:  { type: String, default: '' },
    },
    slug: {
      type:     String,
      unique:   true,
      lowercase: true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    productCount: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Auto-generate slug before saving
categorySchema.pre('save', function (next) {
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

// slug and name are already indexed via unique:true — only add isActive
categorySchema.index({ isActive: 1 })

const Category = mongoose.model('Category', categorySchema)
export default Category
