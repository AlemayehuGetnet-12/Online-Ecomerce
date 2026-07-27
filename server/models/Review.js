import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },
    rating: {
      type:     Number,
      required: [true, 'Rating is required'],
      min:      [1, 'Rating must be at least 1'],
      max:      [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type:     String,
      required: [true, 'Review comment is required'],
      trim:     true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    isVerifiedPurchase: {
      type:    Boolean,
      default: false,
    },
    likes: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Prevent duplicate reviews by same user on same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true })
reviewSchema.index({ product: 1, createdAt: -1 })

// Update product rating after saving a review
reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id:         '$product',
        avgRating:   { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ])

  const Product = (await import('./Product.js')).default
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating:      parseFloat(result[0].avgRating.toFixed(1)),
      reviewCount: result[0].reviewCount,
    })
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product)
})

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.product)
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
