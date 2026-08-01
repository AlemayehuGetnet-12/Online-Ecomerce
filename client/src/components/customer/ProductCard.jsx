import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart }     from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { MdFavorite, MdFavoriteBorder, MdShoppingCart, MdStar } from 'react-icons/md'

const ProductCard = ({ product }) => {
  const { t }                              = useTranslation()
  const { addToCart, isInCart }            = useCart()
  const { toggleWishlist, isInWishlist }   = useWishlist()

  const image  = product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'
  const price  = product.discountedPrice ?? product.price
  const inWish = isInWishlist(product._id)
  const inCart = isInCart(product._id)

  return (
    <div className="card flex flex-col overflow-hidden group" style={{ borderRadius: '0.75rem' }}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '100%' }}>
        <Link to={`/products/${product._id}`} className="absolute inset-0">
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge badge-danger text-[10px] px-2 py-0.5 z-10">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist button — always visible on mobile, hover on desktop */}
        <button
          onClick={() => toggleWishlist(product._id)}
          aria-label="Toggle wishlist"
          className={`
            absolute top-2 right-2 z-10
            w-8 h-8 rounded-full flex items-center justify-center
            bg-white dark:bg-[#1e293b] shadow transition-all duration-200
            md:opacity-0 md:group-hover:opacity-100
            active:scale-90
          `}
        >
          {inWish
            ? <MdFavorite     className="text-red-500 text-base" />
            : <MdFavoriteBorder className="text-gray-500 text-base" />
          }
        </button>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="badge badge-danger text-xs px-3 py-1">{t('products.outOfStock')}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-2 hover:text-[#ea580c] transition-colors mb-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <MdStar className="text-yellow-400 text-xs" />
            <span className="text-[11px] text-gray-500 dark:text-[#94a3b8]">
              {product.rating?.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="font-bold text-[#ea580c] text-sm">{price?.toFixed(0)} ETB</span>
            {product.discount > 0 && (
              <span className="text-[11px] text-gray-400 dark:text-[#94a3b8] line-through">
                {product.price?.toFixed(0)}
              </span>
            )}
          </div>

          {/* Add to cart — full-width, large enough touch target */}
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0 || inCart}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
            style={{
              background: product.stock === 0 || inCart ? '#e5e7eb' : '#ea580c',
              color: product.stock === 0 || inCart ? '#9ca3af' : '#fff',
              minHeight: '36px',
            }}
          >
            <MdShoppingCart className="text-sm flex-shrink-0" />
            <span className="truncate">
              {inCart ? '✓ In Cart' : t('products.addToCart')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
