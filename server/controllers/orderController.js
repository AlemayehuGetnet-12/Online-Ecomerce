import Order   from '../models/Order.js'
import Product  from '../models/Product.js'
import Payment  from '../models/Payment.js'
import { serverError } from '../utils/apiError.js'

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' })
    }

    let itemsTotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` })
      }
      if (!product.isActive) {
        return res.status(400).json({ success: false, message: `Product is not available: ${product.name}` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      const unitPrice = product.discountedPrice || product.price
      const subtotal  = parseFloat((unitPrice * item.quantity).toFixed(2))
      itemsTotal += subtotal

      orderItems.push({
        product:  product._id,
        name:     product.name,
        image:    product.images[0]?.url || '',
        price:    unitPrice,
        quantity: item.quantity,
        subtotal,
      })

      product.stock     -= item.quantity
      product.soldCount += item.quantity
      await product.save()
    }

    const shippingCost = itemsTotal >= 500 ? 0 : 50
    const totalAmount  = parseFloat((itemsTotal + shippingCost).toFixed(2))

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingCost,
      totalAmount,
      paymentMethod,
      notes,
      statusHistory: [{ status: 'pending', updatedBy: req.user._id }],
    })

    await Payment.create({
      user:          req.user._id,
      order:         order._id,
      amount:        totalAmount,
      paymentMethod,
    })

    res.status(201).json({ success: true, message: 'Order placed successfully', order })
  } catch (error) {
    return serverError(res, error, 'createOrder')
  }
}

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const filter = { user: req.user._id }
    if (status) filter.orderStatus = status

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))

    const total  = await Order.countDocuments(filter)
    const orders = await Order.find(filter)
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('items.product', 'name images')
      .lean()

    res.status(200).json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), orders })
  } catch (error) {
    return serverError(res, error, 'getMyOrders')
  }
}

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' })
    }

    const payment = await Payment.findOne({ order: order._id }).lean()
    res.status(200).json({ success: true, order, payment })
  } catch (error) {
    return serverError(res, error, 'getOrder')
  }
}

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, sort = '-createdAt' } = req.query

    const filter = {}
    if (status)        filter.orderStatus   = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const sortMap = {
      '-createdAt': { createdAt: -1 },
      'createdAt':  { createdAt: 1 },
      '-total':     { totalAmount: -1 },
      'total':      { totalAmount: 1 },
    }

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const total  = await Order.countDocuments(filter)
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), orders })
  } catch (error) {
    return serverError(res, error, 'getAllOrders')
  }
}

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { orderStatus, note, cancelReason } = req.body

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Cannot update a delivered order' })
    }

    const previousStatus = order.orderStatus

    if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        })
      }
      order.cancelledAt  = new Date()
      order.cancelReason = cancelReason || ''
      await Payment.findOneAndUpdate({ order: order._id }, { paymentStatus: 'cancelled' })
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date()
      if (order.paymentMethod === 'cash_on_delivery') {
        order.paymentStatus = 'paid'
        await Payment.findOneAndUpdate({ order: order._id }, { paymentStatus: 'paid', paidAt: new Date() })
      }
    }

    order.orderStatus = orderStatus
    order.statusHistory.push({ status: orderStatus, note: note || '', updatedBy: req.user._id })
    await order.save()

    res.status(200).json({ success: true, message: 'Order status updated successfully', order })
  } catch (error) {
    return serverError(res, error, 'updateOrderStatus')
  }
}

// @desc    Cancel an order (Customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params
    const { cancelReason } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' })
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      })
    }

    order.orderStatus  = 'cancelled'
    order.cancelledAt  = new Date()
    order.cancelReason = cancelReason || ''
    order.statusHistory.push({
      status:    'cancelled',
      updatedBy: req.user._id,
      note:      cancelReason || 'Cancelled by customer',
    })
    await order.save()

    await Payment.findOneAndUpdate({ order: order._id }, { paymentStatus: 'cancelled' })

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order })
  } catch (error) {
    return serverError(res, error, 'cancelOrder')
  }
}

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders   = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' })
    const paidOrders    = await Order.countDocuments({ paymentStatus: 'paid' })

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10)
      .lean()

    res.status(200).json({
      success: true,
      stats: { totalOrders, pendingOrders, paidOrders, totalRevenue },
      recentOrders,
    })
  } catch (error) {
    return serverError(res, error, 'getOrderStats')
  }
}
