import Order   from '../models/Order.js'
import Product  from '../models/Product.js'
import User     from '../models/User.js'
import Payment  from '../models/Payment.js'
import Review   from '../models/Review.js'

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
  try {
    const { period = 'monthly', year, month } = req.query

    const currentYear  = year ? Number(year) : new Date().getFullYear()
    const currentMonth = month ? Number(month) : new Date().getMonth() + 1

    let dateFilter = {}

    if (period === 'daily') {
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1)
      const endOfMonth   = new Date(currentYear, currentMonth, 0, 23, 59, 59)
      dateFilter = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } }

      const dailySales = await Order.aggregate([
        { $match: { paymentStatus: 'paid', ...dateFilter } },
        {
          $group: {
            _id:         { $dayOfMonth: '$createdAt' },
            totalSales:  { $sum: '$totalAmount' },
            orderCount:  { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ])

      return res.status(200).json({ success: true, period: 'daily', data: dailySales })
    }

    if (period === 'weekly') {
      const startOfYear = new Date(currentYear, 0, 1)
      const endOfYear   = new Date(currentYear, 11, 31, 23, 59, 59)
      dateFilter = { createdAt: { $gte: startOfYear, $lte: endOfYear } }

      const weeklySales = await Order.aggregate([
        { $match: { paymentStatus: 'paid', ...dateFilter } },
        {
          $group: {
            _id:        { $week: '$createdAt' },
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ])

      return res.status(200).json({ success: true, period: 'weekly', data: weeklySales })
    }

    if (period === 'monthly') {
      const startOfYear = new Date(currentYear, 0, 1)
      const endOfYear   = new Date(currentYear, 11, 31, 23, 59, 59)
      dateFilter = { createdAt: { $gte: startOfYear, $lte: endOfYear } }

      const monthlySales = await Order.aggregate([
        { $match: { paymentStatus: 'paid', ...dateFilter } },
        {
          $group: {
            _id:        { $month: '$createdAt' },
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ])

      return res.status(200).json({ success: true, period: 'monthly', data: monthlySales })
    }

    if (period === 'yearly') {
      const yearlySales = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id:        { $year: '$createdAt' },
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id': -1 } },
        { $limit: 5 },
      ])

      return res.status(200).json({ success: true, period: 'yearly', data: yearlySales })
    }

    res.status(400).json({ success: false, message: 'Invalid period specified' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get revenue report
// @route   GET /api/reports/revenue
// @access  Private/Admin
export const getRevenueReport = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])

    const totalOrders = await Order.countDocuments({ paymentStatus: 'paid' })

    const pendingRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'pending', orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: last30Days } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])

    res.status(200).json({
      success: true,
      revenue: {
        total:    totalRevenue[0]?.total || 0,
        orders:   totalOrders,
        pending:  pendingRevenue[0]?.total || 0,
        last30Days: recentRevenue[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get product performance report
// @route   GET /api/reports/products
// @access  Private/Admin
export const getProductReport = async (req, res) => {
  try {
    const topSelling = await Product.find({ isActive: true })
      .sort('-soldCount')
      .limit(10)
      .select('name soldCount stock images price discountedPrice')
      .lean()

    const lowStock = await Product.find({ isActive: true, stock: { $lte: 10 } })
      .sort('stock')
      .limit(20)
      .select('name stock category')
      .populate('category', 'name')
      .lean()

    const outOfStock = await Product.countDocuments({ isActive: true, stock: 0 })

    const topRated = await Product.find({ isActive: true, reviewCount: { $gt: 0 } })
      .sort('-rating')
      .limit(10)
      .select('name rating reviewCount images')
      .lean()

    res.status(200).json({
      success: true,
      topSelling,
      lowStock,
      outOfStock,
      topRated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get customer analytics
// @route   GET /api/reports/customers
// @access  Private/Admin
export const getCustomerReport = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' })

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const newCustomers = await User.countDocuments({
      role:      'customer',
      createdAt: { $gte: last30Days },
    })

    const topCustomers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id:         '$user',
          totalSpent:  { $sum: '$totalAmount' },
          orderCount:  { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ])

    const populatedTopCustomers = await User.populate(topCustomers, {
      path:   '_id',
      select: 'name email avatar',
    })

    const customersWithOrders = await Order.distinct('user')

    res.status(200).json({
      success: true,
      totalCustomers,
      newCustomers,
      customersWithOrders: customersWithOrders.length,
      topCustomers:        populatedTopCustomers.map(c => ({
        user:       c._id,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
      })),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get dashboard summary
// @route   GET /api/reports/dashboard
// @access  Private/Admin
export const getDashboardSummary = async (req, res) => {
  try {
    const totalProducts    = await Product.countDocuments({ isActive: true })
    const totalCustomers   = await User.countDocuments({ role: 'customer' })
    const totalOrders      = await Order.countDocuments()
    const pendingOrders    = await Order.countDocuments({ orderStatus: 'pending' })
    const totalReviews     = await Review.countDocuments()

    // Total items sold across all paid orders
    const soldResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } },
    ])
    const totalSold = soldResult[0]?.totalSold || 0

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    const lowStockProducts = await Product.countDocuments({ isActive: true, stock: { $lte: 10 } })

    // Recent orders with user info
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5)
      .lean()

    // Recent reviews / comments
    const recentReviews = await Review.find()
      .populate('user',    'name avatar')
      .populate('product', 'name images')
      .sort('-createdAt')
      .limit(5)
      .lean()

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        totalRevenue,
        lowStockProducts,
        totalSold,
        totalReviews,
      },
      recentOrders,
      recentReviews,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
