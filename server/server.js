import dotenv from 'dotenv'
dotenv.config()   // ← must be FIRST before any other imports use env vars

import express      from 'express'
import cors         from 'cors'
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

const app = express()

// ── ES module dirname ───────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ── CORS ────────────────────────────────────────────────────────
// Allow comma-separated origins in CLIENT_URL, or fall back to '*'
const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : '*'

app.use(
  cors({
    origin: clientUrls,
    credentials: true,
  })
)

// ── Body parsing ────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

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