import Payment from '../models/Payment.js'
import Order from '../models/Order.js'
import { createTelebirrPayment, verifyTelebirrPayment, handleTelebirrCallback } from '../services/telebirrService.js'
import { createCBEBirrPayment, verifyCBEBirrPayment, handleCBEBirrCallback } from '../services/cbeBirrService.js'

// @desc    Create Telebirr payment
// @route   POST /api/payments/telebirr/create
// @access  Private
export const createTelebirrPaymentController = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body

    if (!orderId || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Order ID and phone number required' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (order.paymentMethod !== 'telebirr') {
      return res.status(400).json({ success: false, message: 'Order payment method is not Telebirr' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order already paid' })
    }

    const result = await createTelebirrPayment({
      orderId:      order._id.toString(),
      amount:       order.totalAmount,
      phoneNumber,
      description:  `Alex Store Order ${order.orderNumber}`,
    })

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message })
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        transactionId:   result.transactionId,
        phoneNumber,
        gatewayResponse: result,
      }
    )

    res.status(200).json({
      success: true,
      message: 'Telebirr payment initiated',
      data: {
        transactionId: result.transactionId,
        paymentUrl:    result.paymentUrl,
        isMock:        result.isMock || false,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Verify Telebirr payment
// @route   POST /api/payments/telebirr/verify
// @access  Private
export const verifyTelebirrPaymentController = async (req, res) => {
  try {
    const { transactionId } = req.body

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID required' })
    }

    const payment = await Payment.findOne({ transactionId }).populate('order')

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' })
    }

    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const result = await verifyTelebirrPayment(transactionId)

    if (result.success && result.status === 'paid') {
      payment.paymentStatus = 'paid'
      payment.paidAt        = new Date()
      await payment.save()

      const order = await Order.findById(payment.order)
      if (order) {
        order.paymentStatus = 'paid'
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed'
        }
        await order.save()
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment,
      })
    }

    res.status(200).json({ success: false, message: result.message || 'Payment verification failed' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create CBE Birr payment
// @route   POST /api/payments/cbebirr/create
// @access  Private
export const createCBEBirrPaymentController = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body

    if (!orderId || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Order ID and phone number required' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (order.paymentMethod !== 'cbe_birr') {
      return res.status(400).json({ success: false, message: 'Order payment method is not CBE Birr' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order already paid' })
    }

    const result = await createCBEBirrPayment({
      orderId:      order._id.toString(),
      amount:       order.totalAmount,
      phoneNumber,
      description:  `Alex Store Order ${order.orderNumber}`,
    })

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message })
    }

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        transactionId:   result.transactionId,
        referenceNumber: result.referenceNumber,
        phoneNumber,
        gatewayResponse: result,
      }
    )

    res.status(200).json({
      success: true,
      message: 'CBE Birr payment initiated',
      data: {
        transactionId:   result.transactionId,
        referenceNumber: result.referenceNumber,
        isMock:          result.isMock || false,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Verify CBE Birr payment
// @route   POST /api/payments/cbebirr/verify
// @access  Private
export const verifyCBEBirrPaymentController = async (req, res) => {
  try {
    const { transactionId } = req.body

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID required' })
    }

    const payment = await Payment.findOne({ transactionId }).populate('order')

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' })
    }

    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const result = await verifyCBEBirrPayment(transactionId)

    if (result.success && result.status === 'paid') {
      payment.paymentStatus = 'paid'
      payment.paidAt        = new Date()
      await payment.save()

      const order = await Order.findById(payment.order)
      if (order) {
        order.paymentStatus = 'paid'
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed'
        }
        await order.save()
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment,
      })
    }

    res.status(200).json({ success: false, message: result.message || 'Payment verification failed' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order', 'orderNumber totalAmount orderStatus')
      .sort('-createdAt')
      .lean()

    res.status(200).json({ success: true, payments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, method } = req.query

    const filter = {}
    if (status) filter.paymentStatus = status
    if (method) filter.paymentMethod = method

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const total    = await Payment.countDocuments(filter)
    const payments = await Payment.find(filter)
      .populate('user', 'name email phone')
      .populate('order', 'orderNumber totalAmount')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    res.status(200).json({
      success: true,
      total,
      page:    pageNum,
      pages:   Math.ceil(total / limitNum),
      payments,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update payment status (Admin)
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id }             = req.params
    const { paymentStatus, notes } = req.body

    const validStatuses = ['pending', 'paid', 'failed', 'cancelled', 'refunded']
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' })
    }

    const payment = await Payment.findById(id)
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' })
    }

    payment.paymentStatus = paymentStatus
    if (notes) payment.notes = notes

    if (paymentStatus === 'paid')     payment.paidAt     = new Date()
    if (paymentStatus === 'failed')   payment.failedAt   = new Date()
    if (paymentStatus === 'refunded') payment.refundedAt = new Date()

    await payment.save()

    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, { paymentStatus })

    res.status(200).json({ success: true, message: 'Payment status updated', payment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
