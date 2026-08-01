import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { MdFavorite, MdFavoriteBorder, MdShoppingCart, MdStar } from 'react-icons/md'

const ProductCard = ({ product }) => {
  const { t } = useTranslation()
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const image     = product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'
  const price     = product.discountedPrice ?? product.price
  const inWish    = isInWishlist(product._id)
  const inCart    = isInCart(product._id)

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/products/${product._id}`}>
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </Link>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge badge-danger text-[11px]">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product._id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Toggle wishlist"
        >
          {inWish
            ? <MdFavorite className="text-red-500 text-lg" />
            : <MdFavoriteBorder className="text-gray-500 text-lg" />
          }
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge badge-danger px-3 py-1 text-xs">{t('products.outOfStock')}</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-2 hover:text-[#ea580c] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <MdStar className="text-yellow-400 text-sm" />
            <span className="text-xs text-gray-500 dark:text-[#94a3b8]">
              {product.rating?.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#ea580c]">{price?.toFixed(2)} ETB</span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 dark:text-[#94a3b8] line-through">{product.price?.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0 || inCart}
            className="btn btn-primary w-full text-xs py-2"
          >
            <MdShoppingCart className="text-sm" />
            {inCart ? t('products.inCart') : t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
