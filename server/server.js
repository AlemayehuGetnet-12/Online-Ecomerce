import dotenv from 'dotenv'
dotenv.config()   // ← must be FIRST before any other imports use env vars

import express      from 'express'
import cors         from 'cors'
import helmet       from 'helmet'
import rateLimit    from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import path         from 'path'
import { fileURLToPath } from 'url'
import connectDB     from './config/database.js'
import errorHandler  from './middleware/errorHandler.js'
import { seedDatabase } from './utils/seed.js'

import authRoutes     from './routes/authRoutes.js'
import productRoutes  from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes    from './routes/orderRoutes.js'
import paymentRoutes  from './routes/paymentRoutes.js'
import reviewRoutes   from './routes/reviewRoutes.js'
import reportRoutes   from './routes/reportRoutes.js'
import contactRoutes  from './routes/contactRoutes.js'

// ── JWT secret guard ─────────────────────────────────────────────
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ FATAL: JWT_SECRET must be set to a strong random string (32+ chars)')
  process.exit(1)
}

// ── CORS origin list ─────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : null

if (process.env.NODE_ENV === 'production' && !allowedOrigins) {
  console.error('❌ FATAL: CLIENT_URL must be set in production')
  process.exit(1)
}

const app = express()

// ── ES module dirname ───────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ── Security headers (helmet) ────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images from CDN
  contentSecurityPolicy: false, // handled by frontend
}))

// ── CORS ────────────────────────────────────────────────────────
app.use(cors({
  origin: allowedOrigins || true, // true = allow all in dev
  credentials: true,
}))

// ── Rate limiting ────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      15,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      300,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
})

app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/',              apiLimiter)

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── NoSQL injection sanitization ────────────────────────────────
app.use(mongoSanitize())

// ── Static files (uploads) ───────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/products',   productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders',     orderRoutes)
app.use('/api/payments',   paymentRoutes)
app.use('/api/reviews',    reviewRoutes)
app.use('/api/reports',    reportRoutes)
app.use('/api/contact',    contactRoutes)

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Alex Store API is running ✅', time: new Date().toISOString() })
)

// ── Serve built client in production ────────────────────────────
// When NODE_ENV=production, serve the Vite build output from ../client/dist
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist')

  // Serve static assets
  app.use(express.static(clientDist))

  // SPA fallback — any non-API GET route returns index.html
  app.get('*', (req, res, next) => {
    // Skip API routes (they should have been handled above)
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// ── Error handler ────────────────────────────────────────────────
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  await seedDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Health: http://localhost:${PORT}/api/health`)
  })
}

start()