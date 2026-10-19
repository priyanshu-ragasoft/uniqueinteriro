import express from 'express'
import { loginAdmin, getAdminProfile, updateAdminCredentials } from '../controllers/authController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public authentication endpoint
router.post('/login', loginAdmin)

// Protected session verification endpoint
router.get('/me', protectAdmin, getAdminProfile)

// Protected update credentials & password endpoint
router.put('/update-credentials', protectAdmin, updateAdminCredentials)

export default router
