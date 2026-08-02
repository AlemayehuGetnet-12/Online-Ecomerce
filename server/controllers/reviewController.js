import Review from '../models/Review.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query

    const sortMap = {
      '-createdAt': { createdAt: -1 },
      'createdAt':  { createdAt: 1 },
      '-rating':    { rating: -1 },
      'rating':     { rating: 1 },
      '-likes':     { likes: -1 },
    }

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))

    const total   = await Review.countDocuments({ product: productId })
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({
      success: true,
      total,
      page:    pageNum,
      pages:   Math.ceil(total / limitNum),
      reviews,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body

    if (!product || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product, rating, and comment are required',
      })
    }

    // Check if product exists
    const productDoc = await Product.findById(product)
    if (!productDoc) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: req.user._id, product })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      })
    }

    // Optional: Check if user purchased this product
    const hasPurchased = await Order.findOne({
      user:          req.user._id,
      'items.product': product,
      orderStatus:   'delivered',
    })

    const review = await Review.create({
      user:   req.user._id,
      product,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: !!hasPurchased,
    })

    const populated = await review.populate('user', 'name avatar')

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review:  populated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id }         = req.params
    const { rating, comment } = req.body

    const review = await Review.findById(id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' })
    }

    if (rating !== undefined) review.rating  = Number(rating)
    if (comment !== undefined) review.comment = comment

    await review.save()

    const populated = await review.populate('user', 'name avatar')

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review:  populated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params

    const review = await Review.findById(id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    // User can delete their own review; admin can delete any
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()

    res.status(200).json({ success: true, message: 'Review deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images price')
      .sort('-createdAt')
      .lean()

    res.status(200).json({ success: true, reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, rating } = req.query
    const filter = {}
    if (rating) filter.rating = Number(rating)

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Number(limit))
    const total    = await Review.countDocuments(filter)

    const reviews = await Review.find(filter)
      .populate('user',    'name email avatar')
      .populate('product', 'name images price')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({ success: true, total, reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
