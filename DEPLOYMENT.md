# Deployment Guide

This guide covers deploying the Online E-commerce app to production and fixing the login error.

## Architecture

- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Node.js + Express (deployed to Render)
- **Database**: MongoDB Atlas (cloud)

## Quick Fix: Login Error on Vercel

If login fails on the deployed Vercel site (e.g., https://alex-online-ecomerce.vercel.app), it means the frontend can't reach the backend API. Follow these steps:

### Step 1: Deploy the Backend on Render

1. Go to [render.com](https://render.com) and create an account
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `alex-online-ecomerce-api`
   - **Runtime**: Node
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=alex-store-super-secret-jwt-key-2024-change-in-production
   JWT_EXPIRE=30d
   CLIENT_URL=https://alex-online-ecomerce.vercel.app
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=<your cloudinary secret>
   ```

6. Click **Create Web Service**
7. Wait for deployment to complete
8. Note your backend URL (e.g., `https://alex-online-ecomerce-api.onrender.com`)

### Step 2: Set VITE_API_URL on Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://alex-online-ecomerce-api.onrender.com` (your Render URL)
4. Click **Save**

### Step 3: Redeploy the Frontend

1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click the **...** menu on the latest deployment
4. Click **Redeploy**
5. Wait for the build to complete

### Step 4: Test Login

After redeployment, test login with:
- **Admin**: `admin@alexstore.com` / `possword`
- **Customer**: `customer@alexstore.com` / `password`

## Seed Data

The database is automatically seeded on server startup with:

The seed only runs if the database is empty (no products).

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your_random_secret` |
| `JWT_EXPIRE` | Token expiry | `30d` |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) | `https://alex-online-ecomerce.vercel.app` |
| `NODE_ENV` | Environment | `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `ng6ytmpu` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `585635264273683` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret` |

### Client (`client/.env` or Vercel env vars)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://alex-online-ecomerce-api.onrender.com` |

> **Note**: If `VITE_API_URL` is not set, the app uses relative `/api` paths. This only works when the server serves the client (single deployment) or with the Vite dev proxy.

## How the API URL Works

The frontend determines the API base URL as follows:

```javascript
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api'
```

- **Development**: `VITE_API_URL` is not set → uses `/api` → Vite proxy forwards to `localhost:5000`
- **Production (separate deployments)**: `VITE_API_URL` is set to the Render URL → uses `https://...onrender.com/api`
- **Production (single server)**: `VITE_API_URL` is not set → uses `/api` → server serves both API and static files

## Mobile Responsiveness

The UI is built mobile-first with Tailwind CSS. All pages are responsive and work on:
- Mobile phones (320px+)
- Tablets (640px+)
- Desktops (1024px+)

Features:
- Mobile bottom navigation bar
- Responsive grids (2 columns on mobile, 4 on desktop)
- Touch-friendly button sizes (min 36px)
- iOS zoom prevention (16px font on inputs)
- Safe area insets for notched phones
- Horizontal scroll snap for category rows