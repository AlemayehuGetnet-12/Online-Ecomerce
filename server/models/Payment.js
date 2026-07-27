import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    order: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Order',
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
      min:      0,
    },
    paymentMethod: {
      type:     String,
      enum:     ['telebirr', 'cbe_birr', 'cash_on_delivery'],
      required: true,
    },
    transactionId: {
      type:    String,
      default: '',
    },
    referenceNumber: {
      type:    String,
      default: '',
    },
    phoneNumber: {
      type:    String,
      default: '',
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    paidAt:     { type: Date },
    failedAt:   { type: Date },
    refundedAt: { type: Date },
    notes:      { type: String },
  },
  { timestamps: true }
)

paymentSchema.index({ user: 1 })
paymentSchema.index({ order: 1 })
paymentSchema.index({ paymentStatus: 1 })
paymentSchema.index({ transactionId: 1 })

const Payment = mongoose.model('Payment', paymentSchema)
export default Payment
