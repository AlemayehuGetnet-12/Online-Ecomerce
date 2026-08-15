import Category from '../models/Category.js'
import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { isActive } = req.query

    const filter = {}
    if (isActive === 'true') {
      filter.isActive = true
    }

    const categories = await Category.find(filter).sort('name').lean()

    res.status(200).json({ success: true, categories })
  } catch (error) {
    return serverError(res, error, 'server/controllers/categoryController.js')
  }
}

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findOne({
      $or: [
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
        { slug: id },
      ],
    })

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    res.status(200).json({ success: true, category })
  } catch (error) {
    return serverError(res, error, 'server/controllers/categoryController.js')
  }
}

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' })
    }

    // Check if category already exists
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' })
    }

    // Handle image upload
    let imageData = {}
    if (image && image.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'alex-store/categories',
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
      })
      imageData = { url: result.secure_url, publicId: result.public_id }
    } else if (image) {
      imageData = { url: image, publicId: '' }
    }

    const category = await Category.create({
      name,
      description,
      image: imageData,
    })

    res.status(201).json({ success: true, message: 'Category created successfully', category })
  } catch (error) {
    return serverError(res, error, 'server/controllers/categoryController.js')
  }
}

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { id }                           = req.params
    const { name, description, image, isActive } = req.body

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    // Handle image update
    if (image && image.startsWith('data:')) {
      // Delete old image from Cloudinary
      if (category.image?.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId).catch(() => {})
      }

      const result = await cloudinary.uploader.upload(image, {
        folder: 'alex-store/categories',
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
      })
      category.image = { url: result.secure_url, publicId: result.public_id }
    } else if (image && typeof image === 'object') {
      category.image = image
    }

    if (name !== undefined)        category.name        = name
    if (description !== undefined) category.description = description
    if (isActive !== undefined)    category.isActive    = isActive === 'true' || isActive === true

    await category.save()

    res.status(200).json({ success: true, message: 'Category updated successfully', category })
  } catch (error) {
    return serverError(res, error, 'server/controllers/categoryController.js')
  }
}

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: id })
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsCount} product(s) are using this category.`,
      })
    }

    // Delete image from Cloudinary
    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId).catch(() => {})
    }

    await category.deleteOne()

    res.status(200).json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    return serverError(res, error, 'server/controllers/categoryController.js')
  }
}

import { serverError } from '../utils/apiError.js'
