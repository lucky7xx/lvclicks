# LV Clicks Admin Panel Setup Guide

This guide will help you set up the complete admin panel with MongoDB Atlas and Cloudinary for image storage.

## 📋 Prerequisites

- Node.js 18+ installed
- A MongoDB Atlas account (free tier)
- A Cloudinary account (free tier)

---

## 🚀 Step-by-Step Setup

### 1. MongoDB Atlas Setup

1. **Create a Free MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Click "Try Free" or "Start Free" and create an account
   - You may need to verify your email

2. **Create a Cluster (FREE)**
   - After login, you'll see "Create a deployment" or "Build a Database"
   - Click on it
   - **IMPORTANT**: Look for "Shared" option (this is the free tier)
   - Under "Shared" (formerly M0), you'll see:
     - **M0** - Free cluster (512 MB storage)
     - This is what you want!
   - Choose a cloud provider (AWS, Google Cloud, or Azure - any works)
   - Choose a region closest to you
   - Give your cluster a name (optional, default is fine)
   - Click "Create Deployment" or "Create Cluster"
   - Wait 1-3 minutes for cluster to be created

3. **Create Database User**
   - Click "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your specific IP)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add the database name at the end: `lvclicks`
   - Final format: `mongodb+srv://username:password@cluster.mongodb.net/lvclicks?retryWrites=true&w=majority`

### 2. Cloudinary Setup

1. **Create a Free Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/users/register/free)
   - Sign up for a free account

2. **Get Your Credentials**
   - After login, go to your Dashboard
   - You'll see:
     - Cloud Name
     - API Key
     - API Secret
   - Copy these values

### 3. Project Configuration

1. **Create Environment Variables**
   ```bash
   cd lvclicks-nextjs
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your values:
   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/lvclicks?retryWrites=true&w=majority

   # NextAuth (generate a random secret)
   NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   ```

3. **Generate NextAuth Secret**
   ```bash
   # On Mac/Linux:
   openssl rand -base64 32

   # Or use any random 32-character string
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create Admin User

```bash
npm run create-admin
```

Follow the prompts to create your admin account:
- Enter your name
- Enter your email
- Enter a password (minimum 6 characters)

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Using the Admin Panel

### Accessing the Admin Panel

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with the email and password you created
3. You'll be redirected to the admin dashboard

### Managing Portfolio Images

#### Upload Images

1. Select a category from the sidebar (Wedding, Pre-Wedding, Events, etc.)
2. Click "Choose Image" to select an image from your computer
3. (Optional) Check "Set as Landing Page Image" to display this image on the main portfolio section
4. Click "Upload Image"

**Note:** Each category can have a maximum of 20 images.

#### Set Landing Page Image

- Each category shows one featured image on the main website
- Click the ★ (star) button on any image to set it as the landing page image
- Only one image per category can be the landing page image

#### Delete Images

- Click the "Delete" button on any image to remove it
- Confirm the deletion when prompted

#### View All Images

- On the main website, click on any portfolio category
- A modal will open showing all images in that category
- Users can browse through all uploaded images

---

## 📁 Portfolio Categories

The system supports 8 portfolio categories:

1. **Wedding** - Wedding ceremonies and receptions
2. **Pre-Wedding** - Engagement and pre-wedding shoots
3. **Events** - Birthday parties, celebrations, etc.
4. **Portraits** - Individual and family portraits
5. **Cinematic** - Video production work
6. **Corporate** - Corporate events and conferences
7. **Maternity** - Pregnancy and maternity shoots
8. **Baby & Newborn** - Baby photography

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Double-check your username and password in the connection string
- Make sure you replaced `<password>` with your actual password (no angle brackets)

**Error: "MongooseServerSelectionError"**
- Check your network access settings in MongoDB Atlas
- Make sure "Allow Access from Anywhere" is enabled (or your IP is whitelisted)

### Cloudinary Upload Issues

**Error: "Failed to upload image"**
- Verify your Cloudinary credentials in `.env.local`
- Check that your Cloud Name, API Key, and API Secret are correct
- Make sure the image file is in a supported format (JPG, PNG, WEBP, etc.)

### Admin Login Issues

**Error: "Invalid email or password"**
- Make sure you created an admin user using `npm run create-admin`
- Check if you're using the correct email and password
- Try creating a new admin user

### Image Not Displaying

- Check your internet connection (images are hosted on Cloudinary)
- Verify the image was uploaded successfully in the admin panel
- Check browser console for any errors

---

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Create admin user
npm run create-admin
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use strong passwords** for admin accounts (12+ characters)
3. **Generate a unique NEXTAUTH_SECRET** for each environment
4. **Restrict MongoDB network access** to your specific IPs in production
5. **Keep your Cloudinary API Secret** secure

---

## 📊 MongoDB Atlas Free Tier Limits

- 512 MB storage
- Shared RAM
- Shared vCPUs
- 10 GB data transfer per month

This is more than enough for the portfolio system!

---

## ☁️ Cloudinary Free Tier Limits

- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 monthly transformations

Perfect for a photography portfolio!

---

## 🌐 Deploying to Production

### Environment Variables

When deploying to Vercel, Netlify, or any hosting platform:

1. Add all variables from `.env.local` to your hosting platform's environment variables
2. Update `NEXTAUTH_URL` to your production domain (e.g., `https://lvclicks.com`)
3. Make sure to generate a NEW `NEXTAUTH_SECRET` for production

### MongoDB Atlas Production Setup

1. In MongoDB Atlas, update "Network Access" to allow your hosting provider's IPs
2. Or continue using "Allow Access from Anywhere" (less secure but simpler)

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the setup steps carefully
3. Check MongoDB Atlas and Cloudinary dashboards for any issues
4. Verify all environment variables are set correctly

---

## ✨ Features

- ✅ Secure admin authentication
- ✅ Image upload with Cloudinary
- ✅ 8 portfolio categories
- ✅ Landing page image selection
- ✅ Maximum 20 images per category
- ✅ Modal view for all category images
- ✅ Responsive design
- ✅ Image deletion
- ✅ Real-time updates
- ✅ MongoDB Atlas database

---

Built with ❤️ by [mystiq.tech](https://mystiq.tech)
