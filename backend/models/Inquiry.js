import mongoose from 'mongoose'

const InquirySchema = new mongoose.Schema(
  {
    inquiryCode: {
      type: String,
      required: true,
      unique: true,
      default: () => `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: 'International',
      trim: true,
    },
    source: {
      type: String,
      default: 'Contact Us Page',
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
      default: 'Monumental Villa',
    },
    budget: {
      type: String,
      required: true,
      default: '$5M - $10M',
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New Inquiry', 'In Review', 'Offer Sent', 'Contract Signed', 'Archived'],
      default: 'New Inquiry',
    },
    statusColor: {
      type: String,
      default: 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10',
    },
  },
  {
    timestamps: true,
  }
)

const Inquiry = mongoose.model('Inquiry', InquirySchema)
export default Inquiry
