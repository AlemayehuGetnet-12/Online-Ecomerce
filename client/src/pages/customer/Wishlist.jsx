import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Loader from '../../components/common/Loader'
import { MdFavorite, MdDelete, MdShoppingCart } from 'react-icons/md'

const Wishlist = () => {
  const { t } = useTranslation()
  const { wishlist, removeFromWishlist, loading } = useWishlist()
  const { addToCart } = useCart()

  if (loading) return <div className="flex flex-col min-h-screen"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader size="xl" /></div><Footer /></div>

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 flex items-center gap-3">
          <MdFavorite className="text-red-500 text-3xl" /> {t('wishlist.title')}
          <span className="text-base font-normal text-gray-500 dark:text-[#94a3b8]">({wishlist.length} items)</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <MdFavorite className="text-7xl text-gray-300 dark:text-[#334155] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-[#e2e8f0] mb-2">{t('wishlist.emptyWishlist')}</h2>
            <Link to="/products" className="btn btn-primary mt-6 px-8 py-3">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map(product => {
              const price = product.discountedPrice ?? product.price
              return (
                <div key={product._id} className="card card-hover flex flex-col overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <Link to={`/products/${product._id}`}>
                      <img src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=?'} alt={product.name} className="w-full h-full object-cover" />
                    </Link>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-2 mb-2 hover:text-[#ea580c]">{product.name}</h3>
                    </Link>
                    <p className="font-bold text-[#ea580c] mb-3">{price?.toFixed(2)} ETB</p>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => addToCart(product)} className="btn btn-primary flex-1 text-xs py-2">
                        <MdShoppingCart /> {t('wishlist.addToCart')}
                      </button>
                      <button onClick={() => removeFromWishlist(product._id)} className="btn btn-secondary p-2 text-red-400 hover:text-red-600">
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Wishlist
