import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

// Helper to generate signed JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'unique_graphics_vault_secure_token_secret_2026_xyz',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  )
}

/**
 * @desc    Authenticate admin & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both executive email and password.',
      })
    }

    // Check if admin exists in MongoDB
    const normalizedEmail = email.toLowerCase().trim()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No authorized administrator found with this email.',
      })
    }

    // Verify password via bcrypt
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access credentials. Passcode verification failed.',
      })
    }

    // Update last login timestamp
    admin.lastLogin = new Date()
    await admin.save({ validateBeforeSave: false })

    // Generate JWT token
    const token = generateToken(admin._id)

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Executive session established.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    console.error('[Login Controller Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication verification.',
      error: error.message,
    })
  }
}

/**
 * @desc    Get currently logged in admin profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      })
    }

    return res.status(200).json({
      success: true,
      admin,
    })
  } catch (error) {
    console.error('[Get Profile Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin profile.',
    })
  }
}

/**
 * @desc    Update admin credentials (Name, Email, Password)
 * @route   PUT /api/auth/update-credentials
 * @access  Private (Protected by JWT)
 */
export const updateAdminCredentials = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body

    const admin = await Admin.findById(req.admin._id).select('+password')
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      })
    }

    // If changing password, current password must be provided and verified
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password.',
        })
      }

      const isMatch = await admin.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.',
        })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters.',
        })
      }

      admin.password = newPassword
    }

    // Update name and email if provided
    if (name && name.trim()) {
      admin.name = name.trim()
    }

    if (email && email.trim()) {
      const normalizedEmail = email.toLowerCase().trim()
      const existing = await Admin.findOne({ email: normalizedEmail, _id: { $ne: admin._id } })
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another account.',
        })
      }
      admin.email = normalizedEmail
    }

    await admin.save()

    // Generate renewed token
    const token = generateToken(admin._id)

    return res.status(200).json({
      success: true,
      message: 'Admin credentials and password updated successfully.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    console.error('[Update Credentials Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update credentials.',
      error: error.message,
    })
  }
}

/**
 * @desc    Auto-seed default admin if database is empty
 */
export const seedDefaultAdmin = async () => {
  try {
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@uniquegraphics.com').toLowerCase()
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin2026'

    const existingAdmin = await Admin.findOne({ email: defaultEmail })
    if (!existingAdmin) {
      await Admin.create({
        name: 'Executive Studio Lead',
        email: defaultEmail,
        password: defaultPassword,
        role: 'superadmin',
      })
      console.log(`[Admin Seeder]: Initial default admin created: ${defaultEmail}`)
    } else {
      console.log(`[Admin Seeder]: Default admin already present: ${defaultEmail}`)
    }
  } catch (error) {
    console.error('[Admin Seeder Error]:', error.message)
  }
}
