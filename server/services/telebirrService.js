/**
 * Telebirr Payment Service
 *
 * This is a clean payment service abstraction for Telebirr.
 *
 * TO INTEGRATE OFFICIAL TELEBIRR API:
 * 1. Obtain credentials from Ethio Telecom / Telebirr Developer Portal
 * 2. Set in .env:
 *      TELEBIRR_API_URL=https://api.telebirr.et (official endpoint)
 *      TELEBIRR_API_KEY=your_api_key
 *      TELEBIRR_API_SECRET=your_api_secret
 *      TELEBIRR_MERCHANT_ID=your_merchant_id
 *      TELEBIRR_APP_ID=your_app_id
 * 3. Replace the mock implementations below with real API calls
 *
 * Current state: Simulated/mock implementation for development/testing.
 */

import axios from 'axios'

const TELEBIRR_BASE_URL = process.env.TELEBIRR_API_URL || 'https://api.telebirr.et'

/**
 * Create a Telebirr payment request
 * @param {Object} params
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} params.phoneNumber  - Customer phone number
 * @param {string} params.description
 * @returns {Object}  { success, transactionId, paymentUrl, message }
 */
export const createTelebirrPayment = async ({ orderId, amount, phoneNumber, description }) => {
  // ─── Replace this block with real Telebirr API call ──────────────────────
  // Example real implementation (requires official credentials):
  //
  // const payload = {
  //   appId:       process.env.TELEBIRR_APP_ID,
  //   merchantId:  process.env.TELEBIRR_MERCHANT_ID,
  //   outTradeNo:  orderId,
  //   totalAmount: amount.toFixed(2),
  //   subject:     description,
  //   notifyUrl:   `${process.env.CLIENT_URL}/api/payments/telebirr/callback`,
  //   returnUrl:   `${process.env.CLIENT_URL}/payment/success`,
  //   timeoutExpress: '30',
  //   receiverMsisdn: phoneNumber,
  //   shortCode:      process.env.TELEBIRR_MERCHANT_ID,
  // }
  //
  // const headers = {
  //   'Content-Type': 'application/json',
  //   'X-API-Key':    process.env.TELEBIRR_API_KEY,
  //   'X-Timestamp':  Date.now().toString(),
  // }
  //
  // const response = await axios.post(`${TELEBIRR_BASE_URL}/payment/create`, payload, { headers })
  // return {
  //   success:       response.data.code === '0',
  //   transactionId: response.data.transactionNo,
  //   paymentUrl:    response.data.toPayUrl,
  //   message:       response.data.msg,
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // MOCK IMPLEMENTATION (development only)
  if (!process.env.TELEBIRR_API_KEY) {
    console.warn('[Telebirr] Using mock payment — add real credentials to go live')
    return {
      success:       true,
      transactionId: `TELE-MOCK-${Date.now()}`,
      paymentUrl:    null,
      message:       'Mock payment initiated successfully',
      isMock:        true,
    }
  }

  return {
    success: false,
    message: 'Telebirr API credentials not configured. Please set TELEBIRR_API_KEY in .env',
  }
}

/**
 * Verify a Telebirr payment
 * @param {string} transactionId
 * @returns {Object}  { success, status, amount, message }
 */
export const verifyTelebirrPayment = async (transactionId) => {
  // ─── Replace this block with real Telebirr API verification ──────────────
  // const response = await axios.get(
  //   `${TELEBIRR_BASE_URL}/payment/query/${transactionId}`,
  //   {
  //     headers: {
  //       'X-API-Key': process.env.TELEBIRR_API_KEY,
  //     },
  //   }
  // )
  // return {
  //   success:  response.data.code === '0',
  //   status:   response.data.tradeState === 'SUCCESS' ? 'paid' : 'pending',
  //   amount:   response.data.totalAmount,
  //   message:  response.data.msg,
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // MOCK IMPLEMENTATION
  if (transactionId.startsWith('TELE-MOCK-')) {
    return { success: true, status: 'paid', amount: null, message: 'Payment verified (mock)' }
  }

  return {
    success: false,
    status:  'pending',
    message: 'Telebirr API credentials not configured',
  }
}

/**
 * Handle Telebirr payment webhook callback
 * @param {Object} callbackData  - Raw callback payload from Telebirr
 * @returns {Object}  { success, transactionId, orderId, status }
 */
export const handleTelebirrCallback = (callbackData) => {
  // ─── Parse and validate real Telebirr callback signature here ────────────
  // Validate HMAC signature from callbackData.sign
  // Extract and return relevant fields
  // ─────────────────────────────────────────────────────────────────────────

  return {
    success:       callbackData.code === '0' || callbackData.isMock === true,
    transactionId: callbackData.transactionNo || callbackData.transactionId,
    orderId:       callbackData.outTradeNo    || callbackData.orderId,
    status:        callbackData.tradeState === 'SUCCESS' ? 'paid' : 'failed',
  }
}
