import app from '../backend/server.js'
import { connectDB } from '../backend/config/db.js'
import { seedDefaultAdmin } from '../backend/controllers/authController.js'
import { seedDefaultInquiries } from '../backend/controllers/inquiryController.js'
import { seedDefaultBlogs } from '../backend/controllers/blogController.js'

let isInitialized = false

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await connectDB()
      await seedDefaultAdmin()
      await seedDefaultInquiries()
      await seedDefaultBlogs()
      isInitialized = true
    } catch (err) {
      console.error('[Vercel Serverless Init Error]:', err)
    }
  }
  return app(req, res)
}
