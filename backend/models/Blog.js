import mongoose from 'mongoose'

const blogContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['paragraph', 'quote', 'heading'],
      default: 'paragraph',
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Architecture',
      enum: ['Architecture', 'Interior Design', 'Commercial', 'Residential', 'Philosophy'],
    },
    tag: {
      type: String,
      default: 'Editorial',
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '/architectural/dubai_villa.jpg',
    },
    author: {
      type: String,
      default: 'Unique Graphics Atelier Lead',
      trim: true,
    },
    content: [blogContentSchema],
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 120,
    },
  },
  {
    timestamps: true,
  }
)

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
