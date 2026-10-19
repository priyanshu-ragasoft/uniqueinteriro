import express from 'express'
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
  clearAllInquiries,
} from '../controllers/inquiryController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protected route to view all inquiries
router.get('/', protectAdmin, getInquiries)

// Public route to submit an inquiry from website forms
router.post('/', createInquiry)

// Protected route to update inquiry status
router.patch('/:id/status', protectAdmin, updateInquiryStatus)

// Protected route to purge all inquiries
router.delete('/purge/all', protectAdmin, clearAllInquiries)

// Protected route to delete inquiry
router.delete('/:id', protectAdmin, deleteInquiry)

export default router
