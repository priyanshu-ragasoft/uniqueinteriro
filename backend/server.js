import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadMediaFile } from './controllers/uploadController.js'
import { protectAdmin } from './middleware/authMiddleware.js'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import { seedDefaultAdmin } from './controllers/authController.js'
import { seedDefaultInquiries } from './controllers/inquiryController.js'
import { seedDefaultBlogs, seedDefaultProjectsAndServices } from './controllers/blogController.js'

// Load environment variables
dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.post('/api/blogs/uploads', express.json({ limit: '200mb' }), protectAdmin, uploadMediaFile)
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(
  '/uploads',
  express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/uploads'))
)
app.use(
  '/website-assets',
  express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../website/website'))
)

// Request logger for security auditing
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`)
  next()
})

// Database connection middleware (ensures DB is connected on Vercel before queries run)
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') {
    return next()
  }

  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('[Database Middleware Error]:', err.message)
    return res.status(500).json({
      success: false,
      message: 'MongoDB Connection Error on Serverless Instance',
      error: err.message,
    })
  }
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/blogs', blogRoutes)

// Root & Healthcheck Routes
app.get(['/', ''], (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Unique Graphics Atelier API',
    database: process.env.MONGO_URI ? 'CONFIGURED' : 'UNCONFIGURED',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (req, res) => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://yadgirshazada789_db_user:1uyS7m1IYpJZhJyu@cluster0.j7sy7lk.mongodb.net/uniquegraphic?retryWrites=true&w=majority'
  const maskedHost = uri.split('@')[1] || 'localhost'
  res.status(200).json({
    status: 'ONLINE',
    service: 'Unique Graphics Atelier API',
    database: process.env.MONGO_URI ? 'CONFIGURED' : 'UNCONFIGURED',
    readyState: mongoose.connection.readyState,
    targetHost: maskedHost,
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
    error: err.message,
    stack: err.stack,
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
    await seedDefaultProjectsAndServices()

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

// Export Express App & Server Starter
export { app, startServer }
export default app

// If executed directly in standalone Node mode (local dev), start listener
if (!process.env.VERCEL) {
  startServer()
}
