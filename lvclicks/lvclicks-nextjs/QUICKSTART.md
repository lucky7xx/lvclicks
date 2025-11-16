# 🚀 Quick Start Guide

Get your LV Clicks website with admin panel up and running in 10 minutes!

## 📦 What You Need

1. **MongoDB Atlas Account** (Free) - [Sign up here](https://www.mongodb.com/cloud/atlas)
2. **Cloudinary Account** (Free) - [Sign up here](https://cloudinary.com/users/register/free)

---

## ⚡ 5-Minute Setup

### Step 1: MongoDB Atlas (2 minutes)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Click "Create a deployment" → Select **"Shared"** (this is FREE) → Choose M0
3. Create database user (Database Access → Add New User → Set username/password)
4. Allow access from anywhere (Network Access → Add IP → 0.0.0.0/0)
5. Get connection string (Database → Connect → Drivers → Copy connection string)

**Your connection string will look like:**
```
mongodb+srv://username:password@cluster.mongodb.net/lvclicks?retryWrites=true&w=majority
```

### Step 2: Cloudinary (1 minute)

1. Sign up at [Cloudinary](https://cloudinary.com)
2. From dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Configure Project (2 minutes)

```bash
cd lvclicks-nextjs

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use any text editor
```

**Paste your values:**
```env
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/lvclicks?retryWrites=true&w=majority
NEXTAUTH_SECRET=any-random-32-character-string-here-use-keyboard-smash
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Install & Run

```bash
# Install dependencies
npm install

# Create your admin account
npm run create-admin

# Start the server
npm run dev
```

---

## 🎉 You're Done!

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

---

## 📸 How to Add Photos

1. Login at http://localhost:3000/admin/login
2. Select a category (Wedding, Events, etc.)
3. Upload images (max 20 per category)
4. Click ★ to set landing page image
5. Done! Photos appear on your website instantly

---

## 🆘 Having Issues?

### Can't Connect to MongoDB?
- Check your connection string has the correct password
- Make sure you allowed access from anywhere (0.0.0.0/0)

### Can't Upload Images?
- Verify Cloudinary credentials in .env.local
- Make sure all three values (cloud_name, api_key, api_secret) are correct

### Can't Login?
- Did you run `npm run create-admin`?
- Check email/password are correct

---

## 📚 Need More Help?

Read the full [SETUP.md](./SETUP.md) guide for detailed instructions and troubleshooting.

---

**That's it! Your photography portfolio is ready to go! 🎨📷**
