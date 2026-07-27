import dotenv from 'dotenv'
dotenv.config()   // ← must be FIRST before any other imports use env vars

import express    from 'express'
import cors       from 'cors'
import connectDB  from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import { seedDatabase } from './utils/seed.js'

import authRoutes     from './routes/authRoutes.js'
import productRoutes  from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes    from './routes/orderRoutes.js'
import paymentRoutes  from './routes/paymentRoutes.js'
import reviewRoutes   from './routes/reviewRoutes.js'
import reportRoutes   from './routes/reportRoutes.js'

const app = express()

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/products',   productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders',     orderRoutes)
app.use('/api/payments',   paymentRoutes)
app.use('/api/reviews',    reviewRoutes)
app.use('/api/reports',    reportRoutes)

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Alex Store API is running ✅', time: new Date().toISOString() })
)

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
