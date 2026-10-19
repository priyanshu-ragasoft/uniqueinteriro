import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Executive Administrator',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an admin email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'director', 'editor'],
      default: 'superadmin',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save hook: Hash password before saving to DB (Mongoose 8 async style)
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Instance method: Compare entered password with hashed password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Admin = mongoose.model('Admin', AdminSchema)
export default Admin
