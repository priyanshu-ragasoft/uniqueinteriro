import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import { seedDefaultAdmin } from './controllers/authController.js'
import { seedDefaultInquiries } from './controllers/inquiryController.js'
import { seedDefaultBlogs } from './controllers/blogController.js'

// Load environment variables
dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger for security auditing
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`)
  next()
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/blogs', blogRoutes)

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Unique Graphics Atelier API',
    database: process.env.MONGO_URI ? 'CONFIGURED' : 'UNCONFIGURED',
    timestamp: new Date().toISOString(),
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  })
})

// Initialize Database & Start Server
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB()

    // 2. Auto-seed initial admin, inquiries, and blogs if not existing
    await seedDefaultAdmin()
    await seedDefaultInquiries()
    await seedDefaultBlogs()

    // 3. Listen on Port
    app.listen(PORT, () => {
      console.log(`===============================================`)
      console.log(` Unique Graphics Studio Backend Server Active `)
      console.log(` Port: http://localhost:${PORT} `)
      console.log(` MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/uniquegraphic'} `)
      console.log(` Default Admin: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@uniquegraphics.com'} `)
      console.log(`===============================================`)
    })
  } catch (err) {
    console.error('Fatal initialization error:', err)
  }
}

startServer()
