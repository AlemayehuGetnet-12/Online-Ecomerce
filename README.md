# Alex Store - Online E-Commerce Management System

Alex Store is a full-stack e-commerce application built with the MERN stack: MongoDB, Express.js, React.js, and Node.js.

The project is designed to provide customers with a modern online shopping experience while giving administrators tools to manage products, categories, customers, inventory, orders, payments, and sales reports.

> Project status: This project is under active development. Some production features, including real payment gateway integration, still require configuration and testing with official provider APIs.

## Features

### Customer Features

- User registration, login, and logout
- Multi-language support
- Product search, filtering, and sorting
- Product details, ratings, and reviews
- Shopping cart
- Wishlist
- Checkout
- Multiple payment options
- Order history and tracking
- User profile management
- Light and dark themes
- Responsive design for mobile, tablet, and desktop

### Admin Features

- Admin dashboard
- Product management
- Category management
- Customer management
- Order management
- Order status updates
- Inventory tracking
- Low-stock monitoring
- Payment management
- Sales reports
- Revenue tracking
- Business analytics

## Technology Stack

### Frontend

- React.js 18
- React Router v6
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons
- Framer Motion
- i18next
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cloudinary

## Project Structure

```text
Alex-Store/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── admin/
│       │   └── customer/
│       ├── context/
│       ├── hooks/
│       ├── locales/
│       ├── pages/
│       │   ├── admin/
│       │   └── customer/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── i18n.js
│
├── server/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── telebirrService.js
│   │   └── cbeBirrService.js
│   ├── utils/
│   └── server.js
│
├── .env.example
├── .gitignore
└── README.md
```

## Requirements

Before running the project, install:

- Node.js v16 or higher
- MongoDB locally or a MongoDB Atlas account
- npm or yarn
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Alex-Store
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/alex-store

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

TELEBIRR_API_URL=https://api.telebirr.et
TELEBIRR_API_KEY=your_telebirr_api_key
TELEBIRR_API_SECRET=your_telebirr_api_secret
TELEBIRR_MERCHANT_ID=your_merchant_id
TELEBIRR_APP_ID=your_app_id

CBE_BIRR_API_URL=https://api.cbebirr.et
CBE_BIRR_API_KEY=your_cbe_birr_api_key
CBE_BIRR_API_SECRET=your_cbe_birr_api_secret
CBE_BIRR_MERCHANT_ID=your_merchant_id

CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The backend API runs on:

```text
http://localhost:5000
```

### 3. Install Frontend Dependencies

Open a new terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on the local development URL provided by Vite.

## Database Models

The application uses MongoDB with Mongoose.

### User

- Name
- Email
- Hashed password
- Phone
- Address
- Avatar
- Role
- Wishlist
- Timestamps

### Product

- Name
- Description
- Price
- Discount
- Category
- Brand
- Stock
- Images
- Rating
- Review count
- Sold count
- Slug
- Tags
- Featured status
- Timestamps

### Category

- Name
- Description
- Image
- Slug
- Product count
- Timestamps

### Order

- User
- Items
- Shipping address
- Items total
- Shipping cost
- Total amount
- Payment method
- Payment status
- Order status
- Status history
- Timestamps

### Payment

- User
- Order
- Amount
- Payment method
- Transaction ID
- Reference number
- Payment status
- Gateway response
- Timestamps

### Review

- User
- Product
- Rating
- Comment
- Verified purchase status
- Timestamps

## API Endpoints

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password
GET    /api/auth/wishlist
POST   /api/auth/wishlist/:id
DELETE /api/auth/wishlist/:id
```

### Products

```text
GET    /api/products
GET    /api/products/featured
GET    /api/products/best-selling
GET    /api/products/on-sale
GET    /api/products/:id
GET    /api/products/:id/related
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PUT    /api/products/:id/stock
GET    /api/products/admin/low-stock
```

### Categories

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Orders

```text
POST   /api/orders
GET    /api/orders/my-orders
GET    /api/orders/:id
PUT    /api/orders/:id/cancel
GET    /api/orders
PUT    /api/orders/:id/status
GET    /api/orders/stats
```

### Payments

```text
POST   /api/payments/telebirr/create
POST   /api/payments/telebirr/verify
POST   /api/payments/cbebirr/create
POST   /api/payments/cbebirr/verify
GET    /api/payments/history
GET    /api/payments
PUT    /api/payments/:id
```

### Reviews

```text
GET    /api/reviews/product/:id
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id
GET    /api/reviews/my-reviews
```

### Admin Reports

```text
GET    /api/reports/dashboard
GET    /api/reports/sales
GET    /api/reports/revenue
GET    /api/reports/products
GET    /api/reports/customers
```

## Payment System

The project is designed to support:

- Telebirr
- CBE Birr
- Cash on Delivery

For development and testing, payment services may use mock responses when real API credentials are not configured.

For production payment processing:

1. Obtain official API credentials from the payment provider.
2. Add the credentials to the server `.env` file.
3. Configure the payment service.
4. Implement the required official API calls.
5. Implement payment verification and callback handling.
6. Test the payment flow thoroughly before going live.

Payment service files:

```text
server/services/telebirrService.js
server/services/cbeBirrService.js
```

> Real production payment processing requires official payment gateway credentials and implementation based on the provider's current documentation.

## Multi-Language Support

The project is designed to support six languages:

1. English (`en`)
2. Amharic (`am`)
3. Afaan Oromo (`om`)
4. Tigrinya (`ti`)
5. Arabic (`ar`)
6. French (`fr`)

Translation files are located in:

```text
client/src/locales/
```

To add a new language:

1. Create a translation file.
2. Follow the existing translation structure.
3. Register the language in `client/src/i18n.js`.
4. Add the language to the language switcher.

Arabic includes RTL support.

## Theme Support

Alex Store supports:

- Light mode
- Dark mode
- Saved theme preference
- Smooth theme transitions
- Theme-aware components
- Tailwind CSS dark mode

## Responsive Design

The application is designed for:

- Mobile devices
- Tablets
- Desktop computers

## Security

The project includes:

- JWT authentication
- Password hashing with bcrypt
- Protected frontend routes
- Protected backend routes
- Role-based authorization
- Input validation
- CORS configuration
- Secure HTTP headers
- Environment variables for sensitive configuration

For production deployment, use strong secrets, HTTPS, secure environment variables, and up-to-date security practices.

## Deployment

### Frontend

Build the React application:

```bash
cd client
npm run build
```

The production build is generated in the `dist` directory.

The frontend can be deployed to a hosting service such as Vercel.

### Backend

The Node.js and Express backend can be deployed to a Node.js hosting platform such as Render or Railway.

Before deployment:

- Configure production environment variables.
- Set the production MongoDB connection string.
- Configure the frontend URL.
- Configure Cloudinary credentials.
- Configure payment credentials.
- Set `NODE_ENV=production`.

### MongoDB Atlas

For a cloud database:

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure network access.
4. Copy the MongoDB connection string.
5. Add it to `MONGO_URI`.

### Cloudinary

For image storage:

1. Create a Cloudinary account.
2. Get the required API credentials.
3. Add them to the backend environment variables.
4. Configure image upload functionality.

## Project Status

Alex Store is currently under development.

The project is being developed around the following core areas:

- Authentication
- Product management
- Category management
- Shopping cart
- Wishlist
- Orders
- Payments
- Reviews
- Inventory
- Admin reports
- Multi-language support

Additional implementation and testing may be required before using the project in a production business environment.

### Planned Improvements

- Complete all customer pages
- Complete all admin dashboard pages
- Improve form validation
- Improve loading and error handling
- Add pagination
- Add dashboard charts
- Complete API testing
- Test authentication flows
- Test order placement
- Test payment workflows
- Test admin functionality
- Perform cross-browser testing
- Complete mobile responsiveness testing

## Contributing

Contributions and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git add .
git commit -m "Add your feature"
```

5. Push your branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

## License

This project is open-source and available for educational and commercial purposes.

## Author

Alex Store Development Team

## Acknowledgments

- React.js community
- Node.js community
- MongoDB community
- Express.js community
- Tailwind CSS community
- Vite community
- Open-source contributors

## Support

If you find a problem or have a suggestion, please open an issue in the GitHub repository.

---

Built with the MERN stack.
