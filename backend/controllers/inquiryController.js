import Inquiry from '../models/Inquiry.js'

// All static dummy data removed - database starts clean for genuine client submissions only


/**
 * @desc    Get all client inquiries
 * @route   GET /api/inquiries
 * @access  Private
 */
export const getInquiries = async (req, res) => {
  try {
    // Automatically ensure static dummy entries are purged from MongoDB
    await Inquiry.deleteMany({
      $or: [
        { inquiryCode: { $in: ['INQ-9481', 'INQ-9480', 'INQ-9479', 'INQ-9478'] } },
        { client: { $in: ['Al Maktoum Holdings', 'Lord Harrington Private Office', 'Chalet Mont-Blanc Group', 'Dr. Kenji & Associates'] } },
      ],
    })

    const inquiries = await Inquiry.find().sort({ createdAt: -1 })
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    })
  } catch (error) {
    console.error('[Get Inquiries Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve client inquiries.',
    })
  }
}

/**
 * @desc    Create a new client inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res) => {
  try {
    const { client, location, projectType, budget, message, email, phone, source } = req.body

    if (!client || !client.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required.',
      })
    }

    const inquiry = await Inquiry.create({
      client: client.trim(),
      location: (location && location.trim()) || 'International Client',
      projectType: projectType || 'Interior / Architectural Project',
      budget: budget || 'Consultation Requested',
      message: message || '',
      email: email || '',
      phone: phone || '',
      source: source || 'Contact Us Page',
    })

    return res.status(201).json({
      success: true,
      message: 'Inquiry registered successfully.',
      data: inquiry,
    })
  } catch (error) {
    console.error('[Create Inquiry Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to submit client inquiry.',
    })
  }
}

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/inquiries/:id/status
 * @access  Private
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body
    const inquiry = await Inquiry.findById(req.params.id)

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      })
    }

    inquiry.status = status

    // Update status badge styling
    if (status === 'New Inquiry') {
      inquiry.statusColor = 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10'
    } else if (status === 'Offer Sent') {
      inquiry.statusColor = 'text-blue-400 border-blue-400/30 bg-blue-400/10'
    } else if (status === 'Contract Signed') {
      inquiry.statusColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    } else if (status === 'In Review') {
      inquiry.statusColor = 'text-amber-300 border-amber-300/30 bg-amber-300/10'
    }

    await inquiry.save()

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated.',
      data: inquiry,
    })
  } catch (error) {
    console.error('[Update Inquiry Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update inquiry status.',
    })
  }
}

/**
 * @desc    Delete client inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private (Admin)
 */
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry dossier not found.' })
    }
    await Inquiry.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      success: true,
      message: `Inquiry ${inquiry.inquiryCode || ''} deleted successfully.`,
    })
  } catch (error) {
    console.error('[Delete Inquiry Error]:', error)
    return res.status(500).json({ success: false, message: 'Failed to delete inquiry.' })
  }
}

/**
 * @desc    Purge dummy entries and keep database clean
 */
export const seedDefaultInquiries = async () => {
  try {
    const deleted = await Inquiry.deleteMany({
      $or: [
        { inquiryCode: { $in: ['INQ-9481', 'INQ-9480', 'INQ-9479', 'INQ-9478'] } },
        { client: { $in: ['Al Maktoum Holdings', 'Lord Harrington Private Office', 'Chalet Mont-Blanc Group', 'Dr. Kenji & Associates'] } },
      ],
    })
    if (deleted.deletedCount > 0) {
      console.log(`[Inquiry Cleanup]: Removed ${deleted.deletedCount} static/dummy inquiries from MongoDB.`)
    }
  } catch (error) {
    console.error('[Inquiry Cleanup Error]:', error.message)
  }
}

/**
 * @desc    Purge all inquiries
 * @route   DELETE /api/inquiries/purge/all
 * @access  Private (Admin)
 */
export const clearAllInquiries = async (req, res) => {
  try {
    const result = await Inquiry.deleteMany({})
    return res.status(200).json({
      success: true,
      message: `Cleaned all entries (${result.deletedCount} items removed).`,
    })
  } catch (error) {
    console.error('[Purge Inquiries Error]:', error)
    return res.status(500).json({ success: false, message: 'Failed to purge inquiries.' })
  }
}

