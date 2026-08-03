import { connectDB } from '../lib/db.js'
import Product from '../lib/Product.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const {
      page = 1,
      limit = 20,
      category,
      sort,
      minPrice,
      maxPrice,
      minRating,
      isFeatured,
      search,
    } = req.query

    const filter = { isActive: true }

    if (category) filter.slug = category
    if (isFeatured === 'true') filter.isFeatured = true
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) }
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) }
    if (minRating) filter.rating = { $gte: Number(minRating) }
    if (search) filter.name = { $regex: search, $options: 'i' }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Number(limit))

    let query = Product.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)

    if (sort === '-soldCount') query = query.sort({ soldCount: -1 })
    else if (sort === '-price') query = query.sort({ price: -1 })
    else if (sort === 'price') query = query.sort({ price: 1 })
    else if (sort === '-rating') query = query.sort({ rating: -1 })
    else if (sort === '-createdAt') query = query.sort({ createdAt: -1 })
    else query = query.sort({ createdAt: -1 })

    const products = await query.lean()
    const total = await Product.countDocuments(filter)

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    })
  } catch (error) {
    console.error('Products error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}