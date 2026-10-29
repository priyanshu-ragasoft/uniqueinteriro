import app from '../backend/server.js'
import { connectDB } from '../backend/config/db.js'
import { seedDefaultAdmin } from '../backend/controllers/authController.js'
import { seedDefaultInquiries } from '../backend/controllers/inquiryController.js'
import { seedDefaultBlogs, seedDefaultProjectsAndServices } from '../backend/controllers/blogController.js'
import mongoose from 'mongoose'

let isSeeded = false

export default async function handler(req, res) {
  try {
    if (mongoose.connection.readyState < 1) {
      await connectDB()
    }
    if (!isSeeded && mongoose.connection.readyState >= 1) {
      await seedDefaultAdmin()
      await seedDefaultInquiries()
      await seedDefaultBlogs()
      await seedDefaultProjectsAndServices()
      isSeeded = true
    }
  } catch (err) {
    console.error('[Vercel Serverless DB Error]:', err.message)
    if (req.url && (req.url.includes('/api/auth/login') || req.url.includes('/api/health'))) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed on serverless worker.',
        error: err.message,
      })
    }
  }

  return app(req, res)
}
