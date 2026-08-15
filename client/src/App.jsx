import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { CartProvider }    from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ProtectedRoute      from './components/common/ProtectedRoute'
import MobileBottomNav     from './components/common/MobileBottomNav'
import Loader              from './components/common/Loader'

// ── Customer Pages (lazy loaded) ──────────────────────────────
const Home           = lazy(() => import('./pages/customer/Home'))
const Products       = lazy(() => import('./pages/customer/Products'))
const ProductDetails = lazy(() => import('./pages/customer/ProductDetails'))
const Cart           = lazy(() => import('./pages/customer/Cart'))
const Wishlist       = lazy(() => import('./pages/customer/Wishlist'))
const Checkout       = lazy(() => import('./pages/customer/Checkout'))
const Payment        = lazy(() => import('./pages/customer/Payment'))
const Login          = lazy(() => import('./pages/customer/Login'))
const Register       = lazy(() => import('./pages/customer/Register'))
const Profile        = lazy(() => import('./pages/customer/Profile'))
const Orders         = lazy(() => import('./pages/customer/Orders'))
const OrderDetails   = lazy(() => import('./pages/customer/OrderDetails'))
const About          = lazy(() => import('./pages/customer/About'))
const Contact        = lazy(() => import('./pages/customer/Contact'))
const HelpCenter     = lazy(() => import('./pages/customer/HelpCenter'))
const Shipping       = lazy(() => import('./pages/customer/Shipping'))
const Returns        = lazy(() => import('./pages/customer/Returns'))
const NotFound       = lazy(() => import('./pages/customer/NotFound'))

// ── Admin Pages (lazy loaded) ─────────────────────────────────
const AdminDashboard      = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductManagement   = lazy(() => import('./pages/admin/ProductManagement'))
const CategoryManagement  = lazy(() => import('./pages/admin/CategoryManagement'))
const OrderManagement     = lazy(() => import('./pages/admin/OrderManagement'))
const CustomerManagement  = lazy(() => import('./pages/admin/CustomerManagement'))
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement'))
const PaymentManagement   = lazy(() => import('./pages/admin/PaymentManagement'))
const SalesReports        = lazy(() => import('./pages/admin/SalesReports'))
const MessageManagement   = lazy(() => import('./pages/admin/MessageManagement'))

// Full-page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" />
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/"                element={<Home />} />
                <Route path="/products"        element={<Products />} />
                <Route path="/products/:id"    element={<ProductDetails />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/about"           element={<About />} />
                <Route path="/about/story"     element={<About />} />
                <Route path="/about/brands"    element={<About />} />
                <Route path="/about/careers"   element={<About />} />
                <Route path="/about/press"     element={<About />} />
                <Route path="/about/developer" element={<About />} />
                <Route path="/contact"         element={<Contact />} />
                <Route path="/help"            element={<HelpCenter />} />
                <Route path="/shipping"        element={<Shipping />} />
                <Route path="/returns"         element={<Returns />} />

                {/* Cart public, rest protected */}
                <Route path="/cart"      element={<Cart />} />
                <Route path="/wishlist"  element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/payment"   element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin"            element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products"   element={<ProtectedRoute adminOnly><ProductManagement /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute adminOnly><CategoryManagement /></ProtectedRoute>} />
                <Route path="/admin/orders"     element={<ProtectedRoute adminOnly><OrderManagement /></ProtectedRoute>} />
                <Route path="/admin/customers"  element={<ProtectedRoute adminOnly><CustomerManagement /></ProtectedRoute>} />
                <Route path="/admin/inventory"  element={<ProtectedRoute adminOnly><InventoryManagement /></ProtectedRoute>} />
                <Route path="/admin/payments"   element={<ProtectedRoute adminOnly><PaymentManagement /></ProtectedRoute>} />
                <Route path="/admin/reports"    element={<ProtectedRoute adminOnly><SalesReports /></ProtectedRoute>} />
                <Route path="/admin/messages"   element={<ProtectedRoute adminOnly><MessageManagement /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <MobileBottomNav />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
