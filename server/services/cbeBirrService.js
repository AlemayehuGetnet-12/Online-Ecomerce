/**
 * CBE Birr Payment Service
 *
 * This is a clean payment service abstraction for CBE Birr.
 *
 * TO INTEGRATE OFFICIAL CBE BIRR API:
 * 1. Obtain credentials from Commercial Bank of Ethiopia / CBE Birr
 * 2. Set in .env:
 *      CBE_BIRR_API_URL=https://api.cbebirr.et (official endpoint)
 *      CBE_BIRR_API_KEY=your_api_key
 *      CBE_BIRR_API_SECRET=your_api_secret
 *      CBE_BIRR_MERCHANT_ID=your_merchant_id
 * 3. Replace the mock implementations below with real API calls
 *
 * Current state: Simulated/mock implementation for development/testing.
 */

import axios from 'axios'

const CBE_BIRR_BASE_URL = process.env.CBE_BIRR_API_URL || 'https://api.cbebirr.et'

/**
 * Create a CBE Birr payment request
 * @param {Object} params
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} params.phoneNumber  - Customer phone number
 * @param {string} params.description
 * @returns {Object}  { success, transactionId, referenceNumber, message }
 */
export const createCBEBirrPayment = async ({ orderId, amount, phoneNumber, description }) => {
  // ─── Replace this block with real CBE Birr API call ─────────────────────
  // Example real implementation (requires official credentials):
  //
  // const payload = {
  //   merchantId:   process.env.CBE_BIRR_MERCHANT_ID,
  //   orderId,
  //   amount:       amount.toFixed(2),
  //   phoneNumber,
  //   description,
  //   notifyUrl:    `${process.env.CLIENT_URL}/api/payments/cbebirr/callback`,
  //   returnUrl:    `${process.env.CLIENT_URL}/payment/success`,
  // }
  //
  // const headers = {
  //   'Content-Type':  'application/json',
  //   'Authorization': `Bearer ${process.env.CBE_BIRR_API_KEY}`,
  // }
  //
  // const response = await axios.post(`${CBE_BIRR_BASE_URL}/payment/create`, payload, { headers })
  // return {
  //   success:         response.data.success,
  //   transactionId:   response.data.transactionId,
  //   referenceNumber: response.data.referenceNumber,
  //   message:         response.data.message,
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // MOCK IMPLEMENTATION (development only)
  if (!process.env.CBE_BIRR_API_KEY) {
    console.warn('[CBE Birr] Using mock payment — add real credentials to go live')
    return {
      success:         true,
      transactionId:   `CBE-MOCK-${Date.now()}`,
      referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
      message:         'Mock payment initiated successfully',
      isMock:          true,
    }
  }

  return {
    success: false,
    message: 'CBE Birr API credentials not configured. Please set CBE_BIRR_API_KEY in .env',
  }
}

/**
 * Verify a CBE Birr payment
 * @param {string} transactionId
 * @returns {Object}  { success, status, amount, message }
 */
export const verifyCBEBirrPayment = async (transactionId) => {
  // ─── Replace this block with real CBE Birr API verification ─────────────
  // const response = await axios.get(
  //   `${CBE_BIRR_BASE_URL}/payment/verify/${transactionId}`,
  //   {
  //     headers: {
  //       'Authorization': `Bearer ${process.env.CBE_BIRR_API_KEY}`,
  //     },
  //   }
  // )
  // return {
  //   success: response.data.success,
  //   status:  response.data.status === 'completed' ? 'paid' : 'pending',
  //   amount:  response.data.amount,
  //   message: response.data.message,
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // MOCK IMPLEMENTATION
  if (transactionId.startsWith('CBE-MOCK-')) {
    return { success: true, status: 'paid', amount: null, message: 'Payment verified (mock)' }
  }

  return {
    success: false,
    status:  'pending',
    message: 'CBE Birr API credentials not configured',
  }
}

/**
 * Handle CBE Birr payment webhook callback
 * @param {Object} callbackData  - Raw callback payload from CBE Birr
 * @returns {Object}  { success, transactionId, orderId, status }
 */
export const handleCBEBirrCallback = (callbackData) => {
  // ─── Parse and validate real CBE Birr callback signature here ───────────
  // Validate signature from callbackData
  // Extract and return relevant fields
  // ─────────────────────────────────────────────────────────────────────────

  return {
    success:       callbackData.success === true || callbackData.isMock === true,
    transactionId: callbackData.transactionId,
    orderId:       callbackData.orderId,
    status:        callbackData.status === 'completed' ? 'paid' : 'failed',
  }
}
