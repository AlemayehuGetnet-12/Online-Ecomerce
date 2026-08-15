import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProductCard from '../../components/customer/ProductCard'
import Loader from '../../components/common/Loader'
import { productAPI, reviewAPI } from '../../services/api'
import { MdStar, MdFavorite, MdFavoriteBorder, MdShoppingCart, MdFlashOn, MdAdd, MdRemove, MdVerified } from 'react-icons/md'
import toast from 'react-hot-toast'

const Stars = ({ rating, size = 'md' }) => {
  const s = size === 'sm' ? 'text-sm' : 'text-xl'
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <MdStar key={i} className={`${s} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

const ProductDetails = () => {
  const { id }  = useParams()
  const { t }   = useTranslation()
  const navigate = useNavigate()
  const { addToCart }        = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated }  = useAuth()

  const [product,  setProduct]  = useState(null)
  const [related,  setRelated]  = useState([])
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty,       setQty]       = useState(1)
  const [tab,       setTab]       = useState('description')
  const [review,    setReview]    = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await productAPI.getOne(id)
        setProduct(data.product)
        const [rel, rev] = await Promise.all([
          productAPI.getRelated(id).catch(() => ({ data: { products: [] } })),
          reviewAPI.getProductReviews(id).catch(() => ({ data: { reviews: [] } })),
        ])
        setRelated(rel.data.products || [])
        setReviews(rev.data.reviews  || [])
      } catch { navigate('/products') }
      finally { setLoading(false) }
    }
    load()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const submitReview = async e => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to leave a review'); return }
    if (review.comment.length < 10) { toast.error('Review must be at least 10 characters'); return }
    setSubmitting(true)
    try {
      await reviewAPI.create({ product: id, ...review })
      toast.success('Review added!')
      const { data } = await reviewAPI.getProductReviews(id)
      setReviews(data.reviews || [])
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="flex flex-col min-h-screen"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader size="xl" /></div><Footer /></div>
  if (!product) return null

  const price = product.discountedPrice ?? product.price
  const images = product.images?.length ? product.images : [{ url: 'https://placehold.co/600x600?text=No+Image' }]

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8 pb-24 md:pb-8">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-[#1e293b] mb-3">
              <img src={images[activeImg]?.url} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-[#ea580c]' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              {product.category && <span className="text-xs text-[#ea580c] font-medium uppercase tracking-wide">{product.category.name}</span>}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Stars rating={product.rating} />
              <span className="text-sm text-gray-500 dark:text-[#94a3b8]">{product.reviewCount} {t('products.reviews')}</span>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-[#ea580c]">{price?.toFixed(2)} ETB</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{product.price?.toFixed(2)}</span>
                  <span className="badge badge-danger">-{product.discount}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {product.stock > 10 && <span className="badge badge-success">In Stock ({product.stock})</span>}
              {product.stock > 0 && product.stock <= 10 && <span className="badge badge-warning">Low Stock (only {product.stock} left)</span>}
              {product.stock === 0 && <span className="badge badge-danger">{t('products.outOfStock')}</span>}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="label mb-0">{t('products.quantity')}:</span>
                <div className="flex items-center border border-gray-300 dark:border-[#334155] rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155]"><MdRemove /></button>
                  <span className="w-12 text-center font-medium text-gray-800 dark:text-[#e2e8f0]">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155]"><MdAdd /></button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap pt-2">
              <button onClick={() => addToCart(product, qty)} disabled={product.stock === 0} className="btn btn-primary flex-1 min-w-[140px] py-3">
                <MdShoppingCart className="text-xl" /> {t('products.addToCart')}
              </button>
              <button
                onClick={() => { addToCart(product, qty); navigate('/checkout') }}
                disabled={product.stock === 0}
                className="btn btn-outline flex-1 min-w-[140px] py-3"
              >
                <MdFlashOn className="text-xl" /> {t('products.buyNow')}
              </button>
              <button onClick={() => toggleWishlist(product._id)} className="btn btn-secondary w-12 h-12 p-0 flex-shrink-0">
                {isInWishlist(product._id) ? <MdFavorite className="text-red-500 text-xl" /> : <MdFavoriteBorder className="text-xl" />}
              </button>
            </div>

            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-[#94a3b8]"><span className="font-medium">Brand:</span> {product.brand}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-10">
          <div className="flex border-b border-gray-200 dark:border-[#334155]">
            {['description', 'reviews'].map(t2 => (
              <button key={t2} onClick={() => setTab(t2)} className={`px-6 py-4 text-sm font-medium transition-colors capitalize ${tab === t2 ? 'border-b-2 border-[#ea580c] text-[#ea580c]' : 'text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c]'}`}>
                {t2} {t2 === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'description' ? (
              <p className="text-gray-700 dark:text-[#94a3b8] leading-relaxed whitespace-pre-wrap">{product.description}</p>
            ) : (
              <div className="space-y-6">
                {reviews.map(rev => (
                  <div key={rev._id} className="border-b border-gray-100 dark:border-[#334155] pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {rev.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-[#e2e8f0]">{rev.user?.name}</p>
                          <Stars rating={rev.rating} size="sm" />
                        </div>
                      </div>
                      {rev.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-xs text-green-600"><MdVerified /> {t('products.verifiedPurchase')}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-[#94a3b8] ml-12">{rev.comment}</p>
                  </div>
                ))}

                {reviews.length === 0 && <p className="text-gray-500 dark:text-[#94a3b8] text-center py-4">{t('products.noReviews')}</p>}

                {/* Write review */}
                {isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#334155]">
                    <h4 className="font-semibold text-gray-900 dark:text-[#e2e8f0] mb-4">{t('products.writeReview')}</h4>
                    <form onSubmit={submitReview} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="label mb-0 mr-2">Rating:</span>
                        {[1,2,3,4,5].map(i => (
                          <button key={i} type="button" onClick={() => setReview(r => ({ ...r, rating: i }))}>
                            <MdStar className={`text-2xl ${i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea className="textarea" rows={4} placeholder="Share your experience..." value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} />
                      <button type="submit" disabled={submitting} className="btn btn-primary">
                        {submitting ? <span className="spinner" /> : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">{t('products.relatedProducts')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      {/* Mobile sticky CTA */}
      {product.stock > 0 && (
        <div className="mobile-sticky-cta md:hidden">
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product, qty)}
              className="btn btn-primary flex-1 py-3 text-sm font-semibold"
            >
              <MdShoppingCart className="text-lg" /> Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product, qty); navigate('/checkout') }}
              className="btn btn-outline flex-1 py-3 text-sm font-semibold"
            >
              <MdFlashOn className="text-lg" /> Buy Now
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default ProductDetails
