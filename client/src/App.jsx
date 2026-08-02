import { Routes, Route } from 'react-router-dom'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { CartProvider }    from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ProtectedRoute      from './components/common/ProtectedRoute'
import MobileBottomNav    from './components/common/MobileBottomNav'

// ── Customer Pages ────────────────────────────────────────────
import Home          from './pages/customer/Home'
import Products      from './pages/customer/Products'
import ProductDetails from './pages/customer/ProductDetails'
import Cart          from './pages/customer/Cart'
import Wishlist      from './pages/customer/Wishlist'
import Checkout      from './pages/customer/Checkout'
import Payment       from './pages/customer/Payment'
import Login         from './pages/customer/Login'
import Register      from './pages/customer/Register'
import Profile       from './pages/customer/Profile'
import Orders        from './pages/customer/Orders'
import OrderDetails  from './pages/customer/OrderDetails'
import About         from './pages/customer/About'
import Contact       from './pages/customer/Contact'
import HelpCenter    from './pages/customer/HelpCenter'
import Shipping      from './pages/customer/Shipping'
import Returns       from './pages/customer/Returns'
import NotFound      from './pages/customer/NotFound'

// ── Admin Pages ───────────────────────────────────────────────
import AdminDashboard      from './pages/admin/AdminDashboard'
import ProductManagement   from './pages/admin/ProductManagement'
import CategoryManagement  from './pages/admin/CategoryManagement'
import OrderManagement     from './pages/admin/OrderManagement'
import CustomerManagement  from './pages/admin/CustomerManagement'
import InventoryManagement from './pages/admin/InventoryManagement'
import PaymentManagement   from './pages/admin/PaymentManagement'
import SalesReports        from './pages/admin/SalesReports'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>              {/* Public */}
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

              {/* Protected customer */}
              <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
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

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Mobile bottom navigation — visible only on phones */}
            <MobileBottomNav />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
