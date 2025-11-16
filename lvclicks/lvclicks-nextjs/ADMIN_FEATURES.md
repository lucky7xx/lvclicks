# 🎨 Admin Panel Features

Complete documentation for the LV Clicks admin panel and portfolio management system.

---

## 🌟 Overview
v
The admin panel allows you to:
- Upload and manage portfolio images across 8 categories
- Set featured "landing page" images for each category
- Delete unwanted images
- View real-time statistics
- Manage up to 20 images per category

---

## 📂 Portfolio Categories

### Available Categories

1. **Wedding** (`wedding`)
   - Wedding ceremonies
   - Reception photos
   - Couple portraits

2. **Pre-Wedding** (`pre-wedding`)
   - Engagement sessions
   - Pre-wedding shoots
   - Love story photography

3. **Events** (`events`)
   - Birthday parties
   - Celebrations
   - Special occasions

4. **Portraits** (`portraits`)
   - Individual portraits
   - Family photos
   - Professional headshots

5. **Cinematic** (`cinematic`)
   - Video production
   - Film stills
   - Cinematic photography

6. **Corporate** (`corporate`)
   - Corporate events
   - Conferences
   - Business photography

7. **Maternity** (`maternity`)
   - Pregnancy photography
   - Maternity sessions
   - Expecting mothers

8. **Baby & Newborn** (`baby`)
   - Newborn photography
   - Baby shoots
   - First moments

---

## 🎯 Key Features

### Image Upload
- **Format Support**: JPG, PNG, WEBP, GIF
- **Storage**: Cloudinary CDN
- **Limit**: 20 images per category
- **Automatic Optimization**: Images are automatically optimized for web

### Landing Page Images
- **Purpose**: One featured image per category displayed on homepage
- **Selection**: Click the ★ star button to mark as landing page
- **Auto-switch**: Setting a new landing page image automatically unsets the previous one
- **Fallback**: Categories without a landing page show a placeholder

### Image Management
- **View**: All images displayed in a grid layout
- **Delete**: One-click deletion with confirmation
- **Reorder**: Images can be reordered (order field in database)
- **Count**: Real-time count of images per category

---

## 🔧 How It Works

### Frontend (User Website)

1. **Portfolio Section**
   - Displays 8 category tiles
   - Each tile shows the landing page image for that category
   - Shows "View X Photos" button with count

2. **Modal View**
   - Click any category to open modal
   - Shows all images for that category
   - Grid layout for easy browsing
   - Close by clicking X or outside modal

### Backend (Admin Panel)

1. **Authentication**
   - Secure NextAuth.js authentication
   - JWT-based sessions
   - Role-based access (admin only)

2. **Image Upload Flow**
   ```
   Select File → Upload to Cloudinary → Save URL to MongoDB → Display in Admin
   ```

3. **Database Structure**
   ```javascript
   PortfolioImage {
     url: String,           // Cloudinary URL
     publicId: String,      // Cloudinary public ID
     category: String,      // One of 8 categories
     isLandingPage: Boolean // Featured image flag
     order: Number,         // Display order
     uploadedAt: Date       // Upload timestamp
   }
   ```

---

## 📊 Technical Details

### API Endpoints

#### `GET /api/portfolio`
Fetch portfolio images

**Query Parameters:**
- `category` - Filter by category
- `landingOnly` - Get only landing page images

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "url": "https://res.cloudinary.com/...",
      "category": "wedding",
      "isLandingPage": true,
      "order": 0
    }
  ]
}
```

#### `POST /api/portfolio`
Upload new image

**Form Data:**
- `file` - Image file
- `category` - Portfolio category
- `isLandingPage` - Boolean flag

**Response:**
```json
{
  "success": true,
  "data": { /* new image object */ }
}
```

#### `DELETE /api/portfolio?id={imageId}`
Delete an image

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

#### `PATCH /api/portfolio`
Update image properties

**Body:**
```json
{
  "id": "image-id",
  "isLandingPage": true
}
```

---

## 🎨 UI Components

### Admin Dashboard
- **Header**: Logo, user info, logout button
- **Sidebar**: Category navigation with counters
- **Upload Section**: File upload with preview
- **Gallery**: Grid of uploaded images

### Login Page
- Clean, minimal design
- Email/password authentication
- Error handling
- Redirect to dashboard on success

### Portfolio (Frontend)
- Responsive grid layout
- Hover effects on images
- Modal with smooth animations
- Instagram CTA section

---

## 🔐 Security Features

1. **Authentication Required**
   - All admin routes protected
   - Session-based authentication
   - Automatic logout on session expiry

2. **Image Upload Security**
   - File type validation
   - Size limits enforced by Cloudinary
   - Secure upload signatures

3. **Database Security**
   - MongoDB connection with authentication
   - Environment variables for credentials
   - Mongoose schema validation

---

## 📱 Responsive Design

### Desktop (> 768px)
- 3-column footer
- Multi-column portfolio grid
- Sidebar navigation

### Tablet (768px - 1024px)
- 2-column portfolio grid
- Responsive sidebar

### Mobile (< 768px)
- Single column layouts
- Touch-optimized controls
- Stacked navigation

---

## 🚀 Performance Optimizations

1. **Image Optimization**
   - Cloudinary automatic optimization
   - Next.js Image component
   - Lazy loading

2. **Database Queries**
   - Indexed queries on category and isLandingPage
   - Efficient MongoDB aggregation
   - Pagination support (for future)

3. **Caching**
   - MongoDB connection pooling
   - Browser caching for images
   - CDN delivery via Cloudinary

---

## 📈 Scalability

### Current Limits
- **Images per category**: 20
- **Total images**: 160 (20 × 8 categories)
- **MongoDB Free Tier**: 512 MB (plenty of space)
- **Cloudinary Free Tier**: 25 GB storage

### Future Enhancements
- Pagination for large galleries
- Image reordering with drag & drop
- Bulk upload support
- Image editing tools
- Client galleries (private links)
- Watermarking

---

## 🛠️ Customization

### Add More Categories

1. Update the category type in `src/models/Portfolio.ts`:
```typescript
export type PortfolioCategory =
  | 'wedding'
  | 'pre-wedding'
  | 'your-new-category'; // Add here
```

2. Update category labels in `src/components/Portfolio.tsx`:
```typescript
const categoryLabels = {
  // ... existing
  'your-new-category': { title: 'Title', subtitle: 'Subtitle' }
};
```

3. Update admin dashboard categories in `src/app/admin/dashboard/page.tsx`

### Change Image Limits

Edit `src/app/api/portfolio/route.ts`:
```typescript
if (count >= 20) { // Change this number
  return NextResponse.json(
    { error: 'Maximum X images allowed' },
    { status: 400 }
  );
}
```

### Customize Styling

All styles are in `src/app/globals.css`:
- Colors: CSS variables (`:root`)
- Admin styles: `.admin-*` classes
- Modal styles: `.portfolio-modal-*` classes

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas
- **Cloudinary**: https://cloudinary.com/documentation
- **NextAuth.js**: https://next-auth.js.org

---

## 💡 Tips & Tricks

1. **Optimize Images Before Upload**
   - Resize to 2000x2000px max
   - Use JPG for photos, PNG for graphics
   - Compress images before uploading

2. **Organize Your Workflow**
   - Upload images in batches
   - Set landing page images first
   - Delete test images before going live

3. **Backup Your Data**
   - Export MongoDB data regularly
   - Keep Cloudinary backup enabled
   - Document your admin credentials

4. **Performance Tips**
   - Clear browser cache if images don't update
   - Use Chrome DevTools to monitor uploads
   - Check Cloudinary dashboard for usage stats

---

Built with ❤️ for LV Clicks Photography
