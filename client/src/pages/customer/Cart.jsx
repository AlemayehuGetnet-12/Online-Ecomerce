import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { MdAdd, MdRemove, MdDelete, MdShoppingBag, MdLocalShipping } from 'react-icons/md'

const Cart = () => {
  const { t } = useTranslation()
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const navigate = useNavigate()

  const subtotal     = getCartTotal()
  const shippingCost = subtotal >= 500 ? 0 : 50
  const total        = subtotal + shippingCost

  if (cart.length === 0) return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <MdShoppingBag className="text-7xl text-gray-300 dark:text-[#334155] mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-[#e2e8f0] mb-2">{t('cart.emptyCart')}</h2>
        <p className="text-gray-500 dark:text-[#94a3b8] mb-8">{t('cart.startShopping')}</p>
        <Link to="/products" className="btn btn-primary px-8 py-3">{t('cart.continueShopping')}</Link>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => {
              const price = item.discountedPrice ?? item.price
              return (
                <div key={item._id} className="card p-4 flex gap-4 items-start">
                  <img src={item.images?.[0]?.url || 'https://placehold.co/80x80?text=?'} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-2">{item.name}</h3>
                    <p className="text-[#ea580c] font-bold mt-1">{price?.toFixed(2)} ETB</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-300 dark:border-[#334155] rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155]"><MdRemove className="text-sm" /></button>
                        <span className="w-10 text-center text-sm font-medium dark:text-[#e2e8f0]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155]"><MdAdd className="text-sm" /></button>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-[#94a3b8]">{t('cart.subtotal')}: <strong className="text-gray-800 dark:text-[#e2e8f0]">{(price * item.quantity).toFixed(2)} ETB</strong></span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-[#334155] rounded-lg transition-colors flex-shrink-0">
                    <MdDelete className="text-xl" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                  <span>{t('cart.subtotal')}</span>
                  <span>{subtotal.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                  <span>{t('cart.shippingCost')}</span>
                  <span className={shippingCost === 0 ? 'text-green-500 font-medium' : ''}>{shippingCost === 0 ? t('cart.free') : `${shippingCost.toFixed(2)} ETB`}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-500 dark:text-[#94a3b8] flex items-center gap-1"><MdLocalShipping className="text-green-500" />{t('cart.freeShipping')}</p>
                )}
                <div className="border-t border-gray-200 dark:border-[#334155] pt-3 flex justify-between font-bold text-gray-900 dark:text-[#e2e8f0]">
                  <span>{t('cart.grandTotal')}</span>
                  <span className="text-[#ea580c]">{total.toFixed(2)} ETB</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full py-3 mt-6">{t('cart.proceedToCheckout')}</button>
              <Link to="/products" className="btn btn-secondary w-full py-3 mt-3 text-center">{t('cart.continueShopping')}</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Cart
