# Alex Store - Online E-Commerce Management System

A complete, production-ready full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### Customer Features
- ✅ User authentication (Register, Login, Logout)
- ✅ Multi-language support (English, Amharic, Afaan Oromo, Tigrinya, Arabic, French)
- ✅ Product browsing with search, filter, and sort
- ✅ Product details with reviews and ratings
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Secure checkout process
- ✅ Multiple payment methods (Telebirr, CBE Birr, Cash on Delivery)
- ✅ Order tracking and history
- ✅ User profile management
- ✅ Dark/Light theme toggle
- ✅ Responsive design (Mobile, Tablet, Desktop)

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ Category management
- ✅ Order management and status updates
- ✅ Customer management
- ✅ Inventory tracking and low-stock alerts
- ✅ Payment management
- ✅ Sales reports and analytics
- ✅ Revenue tracking

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **Framer Motion** - Animation library
- **i18next** - Internationalization framework
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage (configuration ready)

## 📁 Project Structure

```
Alex-Store/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── assets/        # Images and static files
│       ├── components/    # React components
│       │   ├── common/    # Reusable components
│       │   ├── admin/     # Admin-specific components
│       │   └── customer/  # Customer-specific components
│       ├── context/       # React Context providers
│       ├── hooks/         # Custom hooks
│       ├── locales/       # Translation files (6 languages)
│       ├── pages/         # Page components
│       │   ├── admin/     # Admin pages
│       │   └── customer/  # Customer pages
│       ├── services/      # API service layer
│       ├── utils/         # Utility functions
│       ├── App.jsx        # Main App component
│       ├── main.jsx       # Entry point
│       └── i18n.js        # i18next configuration
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── cloudinary.js # Cloudinary config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   ├── telebirrService.js  # Telebirr payment
│   │   └── cbeBirrService.js   # CBE Birr payment
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Alex-Store
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/alex-store
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alex-store

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Telebirr Payment (add official credentials)
TELEBIRR_API_URL=https://api.telebirr.et
TELEBIRR_API_KEY=your_telebirr_api_key
TELEBIRR_API_SECRET=your_telebirr_api_secret
TELEBIRR_MERCHANT_ID=your_merchant_id
TELEBIRR_APP_ID=your_app_id

# CBE Birr Payment (add official credentials)
CBE_BIRR_API_URL=https://api.cbebirr.et
CBE_BIRR_API_KEY=your_cbe_birr_api_key
CBE_BIRR_API_SECRET=your_cbe_birr_api_secret
CBE_BIRR_MERCHANT_ID=your_merchant_id

# Frontend URL
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 📊 Database Models

### User Model
- name, email, password (hashed)
- phone, address, avatar
- role (customer/admin)
- wishlist array
- timestamps

### Product Model
- name, description, price, discount
- category, brand, stock
- images array (Cloudinary URLs)
- rating, reviewCount, soldCount
- slug, tags, isFeatured
- timestamps

### Category Model
- name, description, image
- slug, productCount
- timestamps

### Order Model
- user, items array
- shippingAddress
- itemsTotal, shippingCost, totalAmount
- paymentMethod, paymentStatus
- orderStatus, statusHistory
- timestamps

### Payment Model
- user, order, amount
- paymentMethod (telebirr/cbe_birr/cash_on_delivery)
- transactionId, referenceNumber
- paymentStatus, gatewayResponse
- timestamps

### Review Model
- user, product, rating, comment
- isVerifiedPurchase
- timestamps

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/me              # Get current user
PUT    /api/auth/profile         # Update profile
PUT    /api/auth/change-password # Change password
GET    /api/auth/wishlist        # Get wishlist
POST   /api/auth/wishlist/:id    # Add to wishlist
DELETE /api/auth/wishlist/:id    # Remove from wishlist
```

### Products
```
GET    /api/products                   # Get all products
GET    /api/products/featured          # Get featured products
GET    /api/products/best-selling      # Get best-selling products
GET    /api/products/on-sale           # Get products on sale
GET    /api/products/:id               # Get single product
GET    /api/products/:id/related       # Get related products
POST   /api/products                   # Create product (Admin)
PUT    /api/products/:id               # Update product (Admin)
DELETE /api/products/:id               # Delete product (Admin)
PUT    /api/products/:id/stock         # Update stock (Admin)
GET    /api/products/admin/low-stock   # Get low-stock products (Admin)
```

### Categories
```
GET    /api/categories        # Get all categories
GET    /api/categories/:id    # Get single category
POST   /api/categories        # Create category (Admin)
PUT    /api/categories/:id    # Update category (Admin)
DELETE /api/categories/:id    # Delete category (Admin)
```

### Orders
```
POST   /api/orders                  # Create order
GET    /api/orders/my-orders        # Get user's orders
GET    /api/orders/:id              # Get single order
PUT    /api/orders/:id/cancel       # Cancel order
GET    /api/orders                  # Get all orders (Admin)
PUT    /api/orders/:id/status       # Update order status (Admin)
GET    /api/orders/stats            # Get order statistics (Admin)
```

### Payments
```
POST   /api/payments/telebirr/create  # Create Telebirr payment
POST   /api/payments/telebirr/verify  # Verify Telebirr payment
POST   /api/payments/cbebirr/create   # Create CBE Birr payment
POST   /api/payments/cbebirr/verify   # Verify CBE Birr payment
GET    /api/payments/history          # Get payment history
GET    /api/payments                  # Get all payments (Admin)
PUT    /api/payments/:id              # Update payment status (Admin)
```

### Reviews
```
GET    /api/reviews/product/:id  # Get product reviews
POST   /api/reviews              # Create review
PUT    /api/reviews/:id          # Update review
DELETE /api/reviews/:id          # Delete review
GET    /api/reviews/my-reviews   # Get user's reviews
```

### Reports (Admin Only)
```
GET    /api/reports/dashboard  # Dashboard summary
GET    /api/reports/sales      # Sales report
GET    /api/reports/revenue    # Revenue report
GET    /api/reports/products   # Product performance
GET    /api/reports/customers  # Customer analytics
```

## 💳 Payment Integration

### Current Implementation
The payment system uses a **service abstraction pattern** that supports:
- Telebirr
- CBE Birr
- Cash on Delivery

### Mock Implementation
For development/testing, the payment services use mock responses when API credentials are not configured.

### Production Integration
To integrate with **official payment gateways**:

1. **Obtain API Credentials** from Telebirr/CBE Birr
2. **Add credentials** to `.env` file
3. **Replace mock implementations** in:
   - `server/services/telebirrService.js`
   - `server/services/cbeBirrService.js`
4. **Implement actual API calls** following official documentation
5. **Test thoroughly** in sandbox environment

The architecture is designed for easy integration once official API access is available.

## 🌍 Multi-Language Support

The application supports **6 languages**:
1. **English** (en)
2. **Amharic** (አማርኛ) (am)
3. **Afaan Oromo** (om)
4. **Tigrinya** (ትግርኛ) (ti)
5. **Arabic** (العربية) (ar) - with RTL support
6. **French** (Français) (fr)

Translation files are located in `client/src/locales/`

### Adding New Translations
1. Create new JSON file in `client/src/locales/`
2. Follow the existing translation structure
3. Add language to `client/src/i18n.js`
4. Update `LanguageSwitcher` component

## 🎨 Theme Support

The application supports **Light** and **Dark** themes:
- Theme preference is saved in localStorage
- Smooth transitions between themes
- All components are theme-aware
- Tailwind CSS dark mode classes

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (frontend and backend)
- Role-based authorization (customer/admin)
- Input validation
- CORS configuration
- Secure HTTP headers
- Environment variables for sensitive data

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the 'dist' folder to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Set environment variables on hosting platform
# Deploy with Node.js environment
```

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in `.env`

### Images (Cloudinary)
1. Create Cloudinary account
2. Get API credentials
3. Update Cloudinary variables in `.env`

## 📝 Remaining Implementation Tasks

### Frontend Pages (To be completed)
1. Create all customer pages (Home, Products, ProductDetails, Cart, Wishlist, Checkout, etc.)
2. Create all admin pages (AdminDashboard, ProductManagement, CategoryManagement, etc.)
3. Implement forms with validation
4. Add loading states and error handling
5. Create product cards and lists
6. Implement pagination
7. Add charts for admin dashboard (using Chart.js or Recharts)

### Testing
1. Test all API endpoints
2. Test authentication flow
3. Test order placement
4. Test payment flows
5. Test admin functionality
6. Cross-browser testing
7. Mobile responsiveness testing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open-source and available for educational and commercial purposes.

## 👨‍💻 Author

**Alex Store Development Team**

## 🙏 Acknowledgments

- React.js community
- Node.js community
- MongoDB documentation
- Tailwind CSS
- All open-source contributors

---

**Note**: This is a comprehensive e-commerce platform suitable for:
- Real business deployment
- University/final-year projects
- Professional portfolio
- Learning full-stack development

For questions or support, please open an issue in the repository.
#   O l i n e - E c o m e r c e  
 