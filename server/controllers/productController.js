import Product from '../models/Product.js'
import Category from '../models/Category.js'
import cloudinary from '../config/cloudinary.js'

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      isFeatured,
      sort = '-createdAt',
      page  = 1,
      limit = 12,
    } = req.query

    const filter = { isActive: true }

    // Full-text search
    if (search) {
      filter.$text = { $search: search }
    }

    // Category filter
    if (category) {
      const cat = await Category.findOne({ slug: category })
      if (cat) filter.category = cat._id
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' }
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.discountedPrice = {}
      if (minPrice) filter.discountedPrice.$gte = Number(minPrice)
      if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice)
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) }
    }

    // Featured filter
    if (isFeatured === 'true') {
      filter.isFeatured = true
    }

    // Sort mapping
    const sortMap = {
      '-createdAt':        { createdAt: -1 },
      'createdAt':         { createdAt: 1 },
      '-price':            { discountedPrice: -1 },
      'price':             { discountedPrice: 1 },
      '-rating':           { rating: -1 },
      '-soldCount':        { soldCount: -1 },
    }

    const sortQuery = sortMap[sort] || { createdAt: -1 }

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const skip     = (pageNum - 1) * limitNum

    const total    = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .lean()

    res.status(200).json({
      success: true,
      total,
      page:       pageNum,
      pages:      Math.ceil(total / limitNum),
      limit:      limitNum,
      products,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findOne({
      $or: [
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
        { slug: id },
      ],
      isActive: true,
    }).populate('category', 'name slug')

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, discount,
      category, brand, stock, isFeatured, tags,
    } = req.body

    // Validate category
    const categoryDoc = await Category.findById(category)
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: 'Invalid category' })
    }

    // Handle image uploads
    let images = []
    if (req.body.images && Array.isArray(req.body.images)) {
      for (const imageData of req.body.images) {
        if (imageData.startsWith('data:')) {
          const result = await cloudinary.uploader.upload(imageData, {
            folder: 'alex-store/products',
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
          })
          images.push({ url: result.secure_url, publicId: result.public_id })
        } else {
          images.push({ url: imageData, publicId: '' })
        }
      }
    }

    const product = await Product.create({
      name, description,
      price:      Number(price),
      discount:   Number(discount || 0),
      category,
      brand,
      stock:      Number(stock || 0),
      images,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags:       tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    })

    // Update category product count
    await Category.findByIdAndUpdate(category, { $inc: { productCount: 1 } })

    const populated = await product.populate('category', 'name slug')

    res.status(201).json({ success: true, message: 'Product created successfully', product: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name, description, price, discount,
      category, brand, stock, isFeatured, tags, isActive, images,
    } = req.body

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const oldCategory = product.category?.toString()

    // Handle image updates
    if (images && Array.isArray(images)) {
      // Delete old images from Cloudinary
      for (const img of product.images) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId).catch(() => {})
        }
      }

      const newImages = []
      for (const imageData of images) {
        if (imageData.startsWith('data:')) {
          const result = await cloudinary.uploader.upload(imageData, {
            folder: 'alex-store/products',
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
          })
          newImages.push({ url: result.secure_url, publicId: result.public_id })
        } else if (imageData.url) {
          newImages.push(imageData)
        } else {
          newImages.push({ url: imageData, publicId: '' })
        }
      }
      product.images = newImages
    }

    // Update fields
    if (name !== undefined)        product.name        = name
    if (description !== undefined) product.description = description
    if (price !== undefined)       product.price       = Number(price)
    if (discount !== undefined)    product.discount    = Number(discount)
    if (category !== undefined)    product.category    = category
    if (brand !== undefined)       product.brand       = brand
    if (stock !== undefined)       product.stock       = Number(stock)
    if (isFeatured !== undefined)  product.isFeatured  = isFeatured === 'true' || isFeatured === true
    if (isActive !== undefined)    product.isActive    = isActive === 'true' || isActive === true
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())
    }

    await product.save()

    // Update category product counts if category changed
    if (category && oldCategory && category !== oldCategory) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { productCount: -1 } })
      await Category.findByIdAndUpdate(category,    { $inc: { productCount:  1 } })
    }

    const populated = await product.populate('category', 'name slug')

    res.status(200).json({ success: true, message: 'Product updated successfully', product: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Delete images from Cloudinary
    for (const img of product.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {})
      }
    }

    // Decrement category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } })

    await product.deleteOne()

    res.status(200).json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(8)
      .lean()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get best-selling products
// @route   GET /api/products/best-selling
// @access  Public
export const getBestSelling = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort('-soldCount')
      .limit(8)
      .lean()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get discounted products
// @route   GET /api/products/on-sale
// @access  Public
export const getOnSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, discount: { $gt: 0 } })
      .populate('category', 'name slug')
      .sort('-discount')
      .limit(8)
      .lean()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get related products by category
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const related = await Product.find({
      category: product.category,
      _id:      { $ne: product._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(8)
      .lean()

    res.status(200).json({ success: true, products: related })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get low-stock products (Admin)
// @route   GET /api/products/low-stock
// @access  Private/Admin
export const getLowStock = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold || 10)
    const products  = await Product.find({
      isActive: true,
      stock:    { $lte: threshold },
    })
      .populate('category', 'name slug')
      .sort('stock')
      .lean()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update product stock (Admin)
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { id }    = req.params
    const { stock } = req.body

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock value' })
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
      { new: true, runValidators: true }
    ).populate('category', 'name slug')

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Stock updated successfully', product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Admin: get all products including inactive
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort = '-createdAt' } = req.query

    const filter = {}
    if (search)   filter.$text    = { $search: search }
    if (category) filter.category = category

    const sortMap = {
      '-createdAt':  { createdAt: -1 },
      'createdAt':   { createdAt: 1 },
      '-price':      { price: -1 },
      'price':       { price: 1 },
      '-stock':      { stock: -1 },
      'stock':       { stock: 1 },
    }

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const total    = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({
      success: true,
      total,
      page:    pageNum,
      pages:   Math.ceil(total / limitNum),
      products,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
