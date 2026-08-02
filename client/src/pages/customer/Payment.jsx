import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { paymentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdCheckCircle, MdPhone } from 'react-icons/md'

const Payment = () => {
  const { t }       = useTranslation()
  const location    = useLocation()
  const navigate    = useNavigate()
  const { orderId, paymentMethod } = location.state || {}

  const [phone,    setPhone]    = useState('')
  const [txId,     setTxId]     = useState('')
  const [step,     setStep]     = useState('initiate') // initiate | verify | success
  const [loading,  setLoading]  = useState(false)

  useEffect(() => { if (!orderId) navigate('/orders') }, [orderId, navigate])

  const isCOD = paymentMethod === 'cash_on_delivery'

  if (isCOD) return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md w-full">
          <MdCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-3">Order Placed!</h2>
          <p className="text-gray-600 dark:text-[#94a3b8] mb-6">{t('payment.codInstructions')}</p>
          <button onClick={() => navigate('/orders')} className="btn btn-primary px-8 py-3">View My Orders</button>
        </div>
      </main>
      <Footer />
    </div>
  )

  const initiatePayment = async e => {
    e.preventDefault()
    if (!phone) { toast.error('Phone number is required'); return }
    setLoading(true)
    try {
      const fn = paymentMethod === 'telebirr' ? paymentAPI.createTelebirr : paymentAPI.createCBEBirr
      const { data } = await fn({ orderId, phoneNumber: phone })
      setTxId(data.data?.transactionId || '')
      toast.success('Payment initiated! Check your phone.')
      if (data.data?.isMock) toast('Using mock payment for development', { icon: '⚠️' })
      setStep('verify')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to initiate payment') }
    setLoading(false)
  }

  const verifyPayment = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const fn = paymentMethod === 'telebirr' ? paymentAPI.verifyTelebirr : paymentAPI.verifyCBEBirr
      await fn(txId)
      toast.success(t('payment.paymentSuccess'))
      setStep('success')
    } catch (err) { toast.error(err.response?.data?.message || t('payment.paymentFailed')) }
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 text-center">{t('payment.title')}</h1>

          {step === 'success' ? (
            <div className="text-center">
              <MdCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">{t('payment.paymentSuccess')}</h2>
              <button onClick={() => navigate('/orders')} className="btn btn-primary mt-6 px-8 py-3">View My Orders</button>
            </div>
          ) : step === 'initiate' ? (
            <form onSubmit={initiatePayment} className="space-y-5">
              <div className="p-4 bg-orange-50 dark:bg-[#1e293b] rounded-xl text-sm text-gray-700 dark:text-[#94a3b8]">
                <p className="font-semibold text-gray-900 dark:text-[#e2e8f0] mb-1">{t('payment.paymentInstructions')}</p>
                <p>{paymentMethod === 'telebirr' ? t('payment.telebirrInstructions') : t('payment.cbeBirrInstructions')}</p>
              </div>
              <div>
                <label className="label">{t('payment.phoneNumber')}</label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input type="tel" className="input pl-10" placeholder="+251 9xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? <span className="spinner" /> : t('payment.initiatePayment')}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyPayment} className="space-y-5">
              <p className="text-gray-600 dark:text-[#94a3b8] text-sm text-center">Enter the transaction ID you received after payment</p>
              <div>
                <label className="label">{t('payment.transactionId')}</label>
                <input type="text" className="input" placeholder="Transaction ID" value={txId} onChange={e => setTxId(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? <span className="spinner" /> : t('payment.verifyPayment')}
              </button>
              <button type="button" onClick={() => setStep('initiate')} className="btn btn-secondary w-full py-3">Back</button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Payment
