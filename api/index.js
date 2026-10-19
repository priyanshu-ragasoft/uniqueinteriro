import app from '../backend/server.js'
import { connectDB } from '../backend/config/db.js'
import { seedDefaultAdmin } from '../backend/controllers/authController.js'
import { seedDefaultInquiries } from '../backend/controllers/inquiryController.js'
import { seedDefaultBlogs } from '../backend/controllers/blogController.js'
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
      isSeeded = true
    }
  } catch (err) {
    console.error('[Vercel Serverless DB Error]:', err.message)
  }

  return app(req, res)
}
