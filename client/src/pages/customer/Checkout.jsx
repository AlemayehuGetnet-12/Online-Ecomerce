import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdLocationOn, MdPayment } from 'react-icons/md'

const paymentMethods = [
  { value: 'telebirr',        label: 'Telebirr',          icon: '📱', desc: 'Pay with Telebirr mobile wallet' },
  { value: 'cbe_birr',        label: 'CBE Birr',          icon: '🏦', desc: 'Pay with CBE Birr mobile banking' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
]

const Checkout = () => {
  const { t }  = useTranslation()
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    email:    user?.email || '',
    street:   user?.address?.street || '',
    city:     user?.address?.city   || '',
    region:   user?.address?.region || '',
    country:  user?.address?.country || 'Ethiopia',
    zipCode:  '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [notes,   setNotes]   = useState('')
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const subtotal     = getCartTotal()
  const shippingCost = subtotal >= 500 ? 0 : 50
  const total        = subtotal + shippingCost

  const validate = () => {
    const e = {}
    if (!address.fullName) e.fullName = 'Full name is required'
    if (!address.phone)    e.phone    = 'Phone is required'
    if (!address.street)   e.street   = 'Street address is required'
    if (!address.city)     e.city     = 'City is required'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fill all required fields'); return }

    setLoading(true)
    try {
      const items = cart.map(item => ({ product: item._id, quantity: item.quantity }))
      const { data } = await orderAPI.create({ items, shippingAddress: address, paymentMethod, notes })
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/orders/' + data.order._id, { state: { paymentMethod, orderId: data.order._id } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    }
    setLoading(false)
  }

  const F = ({ label, k, type='text', placeholder, required=true }) => (
    <div>
      <label className="label">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} className={`input ${errors[k] ? 'input-error' : ''}`} placeholder={placeholder} value={address[k]} onChange={e => setAddress(a => ({ ...a, [k]: e.target.value }))} />
      {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">{t('checkout.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-5 flex items-center gap-2"><MdLocationOn className="text-[#ea580c]" /> {t('checkout.shippingAddress')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F label={t('checkout.fullName')} k="fullName" placeholder="John Doe" />
                  <F label={t('checkout.phone')} k="phone" type="tel" placeholder="+251 9xx xxx xxx" />
                  <F label={t('checkout.email')} k="email" type="email" placeholder="you@example.com" required={false} />
                  <F label={t('checkout.street')} k="street" placeholder="123 Main St" />
                  <F label={t('checkout.city')} k="city" placeholder="Addis Ababa" />
                  <F label={t('checkout.region')} k="region" placeholder="Addis Ababa" required={false} />
                  <F label={t('checkout.country')} k="country" placeholder="Ethiopia" />
                  <F label={t('checkout.zipCode')} k="zipCode" placeholder="1000" required={false} />
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-5 flex items-center gap-2"><MdPayment className="text-[#ea580c]" /> {t('checkout.paymentMethod')}</h2>
                <div className="space-y-3">
                  {paymentMethods.map(m => (
                    <label key={m.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === m.value ? 'border-[#ea580c] bg-orange-50 dark:bg-[#1e293b]' : 'border-gray-200 dark:border-[#334155] hover:border-gray-300'}`}>
                      <input type="radio" name="paymentMethod" value={m.value} checked={paymentMethod === m.value} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                      <span className="text-3xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-[#e2e8f0]">{m.label}</p>
                        <p className="text-xs text-gray-500 dark:text-[#94a3b8]">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="card p-6">
                <label className="label">{t('checkout.notes')}</label>
                <textarea className="textarea" rows={3} placeholder={t('checkout.notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="card p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">{t('checkout.orderSummary')}</h2>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item._id} className="flex gap-3 text-sm">
                      <img src={item.images?.[0]?.url || 'https://placehold.co/48x48?text=?'} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 dark:text-[#94a3b8]">x{item.quantity}</p>
                      </div>
                      <span className="text-[#ea580c] font-medium whitespace-nowrap">{((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)} ETB</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-[#334155] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                    <span>Items ({cart.length})</span>
                    <span>{subtotal.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-500 font-medium' : ''}>{shippingCost === 0 ? 'FREE' : `${shippingCost} ETB`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-[#e2e8f0] text-base pt-2">
                    <span>Total</span>
                    <span className="text-[#ea580c]">{total.toFixed(2)} ETB</span>
                  </div>
                </div>
                <button type="submit" disabled={loading || cart.length === 0} className="btn btn-primary w-full py-3 mt-6 text-base">
                  {loading ? <span className="spinner" /> : t('checkout.placeOrder')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default Checkout
