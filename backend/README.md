# Unique Graphics — Studio Admin Backend

Backend API for Unique Graphics Luxury Studio, built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and bcrypt.

## Database Connection
- **URI**: `mongodb://localhost:27017/uniquegraphic`

## Default Admin Credentials (Auto-Seeded)
- **Email**: `admin@uniquegraphics.com`
- **Password**: `admin2026`

---

## Folder Structure
```
backend/
├── config/
│   └── db.js                 # Mongoose connection
├── models/
│   ├── Admin.js              # Admin Schema with bcrypt hash pre-save & comparePassword
│   ├── Inquiry.js            # Client Inquiries Schema
│   └── Blog.js               # Luxury Journal & Architectural Essays Schema
├── middleware/
│   └── authMiddleware.js     # JWT Bearer Token verification
├── controllers/
│   ├── authController.js     # loginAdmin, getAdminProfile, seedDefaultAdmin
│   ├── inquiryController.js  # getInquiries, createInquiry, updateInquiryStatus
│   └── blogController.js     # getBlogs, getBlogByIdentifier, createBlog, updateBlog, deleteBlog, seedDefaultBlogs
├── routes/
│   ├── authRoutes.js         # /api/auth/login, /api/auth/me
│   ├── inquiryRoutes.js      # /api/inquiries
│   └── blogRoutes.js         # /api/blogs (GET, POST, PUT, DELETE)
├── .env                      # Port, Mongo URI, JWT Secret
├── server.js                 # Express Entry Point & auto-seeders
└── package.json
```

---

## How to Run

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Server**:
   ```bash
   npm start
   # or with watch mode:
   npm run dev
   ```

The backend server will run on `http://localhost:5000`.
On first launch, it connects to MongoDB (`mongodb://localhost:27017/uniquegraphic`) and automatically seeds the default admin user with encrypted bcrypt password.
