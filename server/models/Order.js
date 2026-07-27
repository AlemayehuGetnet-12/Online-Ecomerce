import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Product',
    required: true,
  },
  name:     { type: String, required: true },
  image:    { type: String, default: '' },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
})

const shippingAddressSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  phone:      { type: String, required: true },
  email:      { type: String },
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  region:     { type: String },
  country:    { type: String, default: 'Ethiopia' },
  zipCode:    { type: String },
})

const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  note:      { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
})

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type:   String,
      unique: true,
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    items:           [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    itemsTotal: {
      type:     Number,
      required: true,
      min:      0,
    },
    shippingCost: {
      type:    Number,
      default: 0,
    },
    discount: {
      type:    Number,
      default: 0,
    },
    totalAmount: {
      type:     Number,
      required: true,
      min:      0,
    },
    paymentMethod: {
      type:     String,
      enum:     ['telebirr', 'cbe_birr', 'cash_on_delivery'],
      required: true,
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type:    String,
      enum:    ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    notes:         { type: String },
    deliveredAt:   { type: Date },
    cancelledAt:   { type: Date },
    cancelReason:  { type: String },
  },
  { timestamps: true }
)

// Indexes
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ createdAt: -1 })

// Auto-generate order number before saving
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8)
    const random    = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderNumber = `ORD-${timestamp}-${random}`
  }
  next()
})

const Order = mongoose.model('Order', orderSchema)
export default Order
