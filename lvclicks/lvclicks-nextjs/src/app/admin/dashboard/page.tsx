'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type PortfolioCategory =
  | 'wedding'
  | 'pre-wedding'
  | 'events'
  | 'portraits'
  | 'cinematic'
  | 'corporate'
  | 'maternity'
  | 'baby';

interface PortfolioImage {
  _id: string;
  url: string;
  category: PortfolioCategory;
  isLandingPage: boolean;
  order: number;
}

const categories: { value: PortfolioCategory; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'pre-wedding', label: 'Pre-Wedding' },
  { value: 'events', label: 'Events' },
  { value: 'portraits', label: 'Portraits' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'baby', label: 'Baby & Newborn' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('wedding');
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [allImages, setAllImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchImages();
      fetchAllImages();
    }
  }, [selectedCategory, session]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio?category=${selectedCategory}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllImages = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) {
        setAllImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching all images:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    if (images.length >= 20) {
      alert('Maximum 20 images allowed per category');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', selectedCategory);
    formData.append('isLandingPage', isLandingPage.toString());

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert('Image uploaded successfully!');
        setUploadFile(null);
        setIsLandingPage(false);
        fetchImages();
        fetchAllImages();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Image deleted successfully!');
        fetchImages();
        fetchAllImages();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const toggleLandingPage = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isLandingPage: !currentValue }),
      });

      const data = await res.json();
      if (data.success) {
        fetchImages();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update image');
    }
  };

  if (status === 'loading') {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <Image src="/lv-logo.png" alt="LV Clicks" width={80} height={40} />
            <h1>Admin Dashboard</h1>
          </div>

          {/* Desktop Menu */}
          <div className="admin-user-menu desktop-menu">
            <span className="welcome-text">Welcome, {session.user?.name}</span>
            <a href="/" className="admin-view-site-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
              </svg>
              View Site
            </a>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="admin-logout-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown">
            <div className="mobile-menu-item welcome-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
              <span>{session.user?.name}</span>
            </div>
            <a href="/" className="mobile-menu-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
              </svg>
              <span>View Site</span>
            </a>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="mobile-menu-item logout-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <div className="admin-container">
        <div className="admin-main">
          <div className="admin-category-selector">
            <label htmlFor="category-select">Select Portfolio Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PortfolioCategory)}
              className="category-dropdown"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({allImages.filter((img) => img.category === cat.value).length}/20)
                </option>
              ))}
            </select>
          </div>

          <div className="admin-upload-section">
            <div className="upload-header">
              <div className="upload-title-group">
                <h2>
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload to {categories.find((c) => c.value === selectedCategory)?.label}
                </h2>
              </div>
              <div className="upload-progress-indicator">
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(images.length / 20) * 100}%` }}></div>
                </div>
                <span className="progress-text">{images.length}/20 images</span>
              </div>
            </div>

            <form onSubmit={handleUpload} className="upload-form">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  id="file-input"
                />
                <label htmlFor="file-input" className="file-input-label">
                  <svg className="upload-cloud-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18a4.5 4.5 0 0 1 0-9 5.5 5.5 0 0 1 11 2 3 3 0 0 1 0 6h-1M12 15v6M15 18l-3-3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="file-label-text">
                    {uploadFile ? (
                      <>
                        <strong>{uploadFile.name}</strong>
                        <small>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</small>
                      </>
                    ) : (
                      <>
                        <strong>Click to browse or drag & drop</strong>
                        <small>PNG, JPG, GIF up to 10MB</small>
                      </>
                    )}
                  </span>
                </label>
              </div>

              <div className="upload-options">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="landing-page"
                    checked={isLandingPage}
                    onChange={(e) => setIsLandingPage(e.target.checked)}
                  />
                  <label htmlFor="landing-page">
                    <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Set as Landing Page Image
                  </label>
                </div>

                <button type="submit" className="upload-submit-btn" disabled={uploading || !uploadFile || images.length >= 20}>
                  {uploading ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="spinner-circle" cx="12" cy="12" r="10" fill="none" strokeWidth="3"/>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload Image
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="admin-gallery-section">
            <h2>Uploaded Images</h2>
            {loading ? (
              <p>Loading images...</p>
            ) : images.length === 0 ? (
              <p className="no-images">No images uploaded yet for this category.</p>
            ) : (
              <div className="admin-gallery-grid">
                {images.map((image) => (
                  <div key={image._id} className="admin-gallery-item">
                    <div className="admin-image-wrapper">
                      <Image src={image.url} alt="Portfolio" width={300} height={300} />
                      {image.isLandingPage && <span className="landing-badge">Landing Page</span>}
                    </div>
                    <div className="admin-image-actions">
                      <button
                        onClick={() => toggleLandingPage(image._id, image.isLandingPage)}
                        className="toggle-landing-btn"
                      >
                        {image.isLandingPage ? '★' : '☆'}
                      </button>
                      <button onClick={() => handleDelete(image._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--black);
        }

        .admin-header {
          background: rgba(212, 175, 55, 0.95);
          padding: 1rem 0;
          border-bottom: 2px solid var(--gold);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-logo h1 {
          font-family: 'Oswald', sans-serif;
          color: var(--black);
          font-size: 1.5rem;
          margin: 0;
        }

        .admin-user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--black);
          font-weight: 600;
        }

        .desktop-menu {
          display: flex;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--black);
          width: 40px;
          height: 40px;
        }

        .mobile-menu-toggle svg {
          width: 28px;
          height: 28px;
        }

        .welcome-text {
          color: var(--black);
          font-weight: 500;
        }

        .admin-logout-btn,
        .admin-view-site-btn {
          padding: 0.65rem 1.25rem;
          background: var(--black);
          color: var(--gold);
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .admin-logout-btn svg,
        .admin-view-site-btn svg {
          width: 18px;
          height: 18px;
        }

        .admin-logout-btn:hover,
        .admin-view-site-btn:hover {
          background: var(--dark-gray);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .mobile-menu-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(26, 26, 26, 0.98);
          border: 1px solid var(--gold);
          border-top: none;
          min-width: 250px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: var(--cream);
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .mobile-menu-item:last-child {
          border-bottom: none;
        }

        .mobile-menu-item svg {
          width: 20px;
          height: 20px;
          fill: var(--gold);
        }

        .mobile-menu-item:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .mobile-menu-item.welcome-item {
          background: rgba(212, 175, 55, 0.15);
          cursor: default;
          font-weight: 600;
        }

        .mobile-menu-item.welcome-item:hover {
          background: rgba(212, 175, 55, 0.15);
        }

        .mobile-menu-item.logout-item {
          color: #ff6b6b;
        }

        .mobile-menu-item.logout-item svg {
          fill: #ff6b6b;
        }

        .mobile-menu-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 80px);
        }

        .admin-main {
          padding: 2rem;
        }

        .admin-category-selector {
          background: var(--dark-gray);
          padding: 1.5rem 2rem;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 2rem;
        }

        .admin-category-selector label {
          display: block;
          font-family: 'Oswald', sans-serif;
          color: var(--gold);
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .category-dropdown {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(26, 26, 26, 0.8);
          border: 2px solid rgba(212, 175, 55, 0.3);
          color: var(--cream);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 3rem;
        }

        .category-dropdown:hover {
          border-color: var(--gold);
          background-color: rgba(26, 26, 26, 0.95);
        }

        .category-dropdown:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        .category-dropdown option {
          background: var(--dark-gray);
          color: var(--cream);
          padding: 0.75rem;
        }

        .admin-upload-section {
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .upload-title-group h2 {
          font-family: 'Oswald', sans-serif;
          color: var(--gold);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
        }

        .upload-icon {
          width: 28px;
          height: 28px;
          stroke: var(--gold);
        }

        .upload-progress-indicator {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar-container {
          width: 150px;
          height: 8px;
          background: rgba(26, 26, 26, 0.8);
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--gold) 0%, var(--light-gold) 100%);
          transition: width 0.5s ease;
          border-radius: 10px;
        }

        .progress-text {
          color: var(--gold);
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .file-input-wrapper input[type='file'] {
          display: none;
        }

        .file-input-label {
          padding: 2.5rem 2rem;
          background: rgba(26, 26, 26, 0.6);
          border: 2px dashed rgba(212, 175, 55, 0.4);
          color: var(--cream);
          cursor: pointer;
          border-radius: 8px;
          text-align: center;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .file-input-label:hover {
          border-color: var(--gold);
          background: rgba(26, 26, 26, 0.8);
          border-style: solid;
        }

        .upload-cloud-icon {
          width: 48px;
          height: 48px;
          stroke: var(--gold);
          opacity: 0.8;
        }

        .file-label-text {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-label-text strong {
          font-size: 1.1rem;
          color: var(--cream);
        }

        .file-label-text small {
          font-size: 0.85rem;
          color: rgba(255, 248, 231, 0.6);
        }

        .upload-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(26, 26, 26, 0.6);
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          transition: all 0.3s;
          cursor: pointer;
        }

        .checkbox-wrapper:hover {
          background: rgba(26, 26, 26, 0.8);
          border-color: var(--gold);
        }

        .checkbox-wrapper input[type='checkbox'] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--gold);
        }

        .checkbox-wrapper label {
          color: var(--cream);
          cursor: pointer;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .star-icon {
          width: 18px;
          height: 18px;
          fill: var(--gold);
          opacity: 0.8;
        }

        .upload-submit-btn {
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, var(--gold) 0%, var(--dark-gold) 100%);
          color: var(--black);
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .upload-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--light-gold) 0%, var(--gold) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }

        .upload-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .check-icon {
          width: 20px;
          height: 20px;
          stroke: var(--black);
        }

        .spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .spinner-circle {
          stroke: var(--black);
          stroke-dasharray: 50;
          stroke-dashoffset: 0;
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 50;
          }
          50% {
            stroke-dashoffset: 25;
          }
          100% {
            stroke-dashoffset: 50;
          }
        }

        .admin-gallery-section h2 {
          font-family: 'Oswald', sans-serif;
          color: var(--gold);
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .no-images {
          color: rgba(255, 248, 231, 0.7);
          text-align: center;
          padding: 3rem;
        }

        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .admin-gallery-item {
          background: var(--dark-gray);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .admin-gallery-item:hover {
          border-color: var(--gold);
          transform: translateY(-4px);
        }

        .admin-image-wrapper {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .admin-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .landing-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--gold);
          color: var(--black);
          padding: 0.3rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
        }

        .admin-image-actions {
          padding: 0.8rem;
          display: flex;
          gap: 0.5rem;
        }

        .toggle-landing-btn,
        .delete-btn {
          flex: 1;
          padding: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .toggle-landing-btn {
          background: rgba(212, 175, 55, 0.2);
          color: var(--gold);
          font-size: 1.2rem;
        }

        .toggle-landing-btn:hover {
          background: var(--gold);
          color: var(--black);
        }

        .delete-btn {
          background: rgba(220, 53, 69, 0.2);
          color: #ff6b6b;
        }

        .delete-btn:hover {
          background: rgba(220, 53, 69, 0.4);
        }

        .admin-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--black);
          color: var(--gold);
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .admin-header {
            position: relative;
          }

          .admin-header-content {
            padding: 0 1rem;
            flex-direction: row;
            justify-content: space-between;
          }

          .admin-logo {
            flex-direction: row;
            gap: 0.75rem;
          }

          .admin-logo h1 {
            font-size: 1.2rem;
          }

          .desktop-menu {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-menu-dropdown {
            display: block;
          }

          .mobile-menu-overlay {
            display: block;
          }

          .admin-main {
            padding: 1rem;
          }

          .admin-category-selector {
            padding: 1.25rem 1.5rem;
          }

          .admin-category-selector label {
            font-size: 1rem;
          }

          .category-dropdown {
            font-size: 0.95rem;
            padding: 0.9rem 1rem;
          }

          .admin-upload-section {
            padding: 1.5rem 1rem;
          }

          .upload-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .upload-title-group h2 {
            font-size: 1.2rem;
          }

          .upload-icon {
            width: 24px;
            height: 24px;
          }

          .progress-bar-container {
            width: 120px;
          }

          .file-input-label {
            padding: 2rem 1.5rem;
          }

          .upload-cloud-icon {
            width: 40px;
            height: 40px;
          }

          .file-label-text strong {
            font-size: 1rem;
          }

          .upload-options {
            flex-direction: column;
            align-items: stretch;
          }

          .checkbox-wrapper {
            width: 100%;
            justify-content: center;
          }

          .upload-submit-btn {
            width: 100%;
            padding: 1rem;
          }

          .admin-gallery-section h2 {
            font-size: 1.2rem;
          }

          .admin-gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
          }

          .admin-image-actions {
            flex-direction: column;
          }

          .toggle-landing-btn,
          .delete-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .admin-header {
            padding: 0.5rem 0;
          }

          .admin-header-content {
            padding: 0 0.75rem;
          }

          .admin-logo h1 {
            font-size: 1rem;
          }

          .mobile-menu-toggle {
            width: 36px;
            height: 36px;
          }

          .mobile-menu-toggle svg {
            width: 24px;
            height: 24px;
          }

          .mobile-menu-dropdown {
            min-width: 200px;
          }

          .mobile-menu-item {
            padding: 0.85rem 1.25rem;
            font-size: 0.95rem;
          }

          .mobile-menu-item svg {
            width: 18px;
            height: 18px;
          }

          .admin-main {
            padding: 0.75rem;
          }

          .admin-category-selector {
            padding: 1rem;
          }

          .admin-category-selector label {
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .category-dropdown {
            font-size: 0.85rem;
            padding: 0.75rem 0.85rem;
            padding-right: 2.5rem;
          }

          .admin-upload-section {
            padding: 1.25rem 0.75rem;
          }

          .upload-title-group h2 {
            font-size: 1.1rem;
          }

          .upload-icon {
            width: 20px;
            height: 20px;
          }

          .progress-bar-container {
            width: 100px;
          }

          .progress-text {
            font-size: 0.8rem;
          }

          .file-input-label {
            padding: 1.75rem 1rem;
          }

          .upload-cloud-icon {
            width: 36px;
            height: 36px;
          }

          .file-label-text strong {
            font-size: 0.95rem;
          }

          .file-label-text small {
            font-size: 0.75rem;
          }

          .checkbox-wrapper {
            padding: 0.65rem 1rem;
            font-size: 0.9rem;
          }

          .star-icon {
            width: 16px;
            height: 16px;
          }

          .upload-submit-btn {
            font-size: 0.9rem;
            padding: 0.9rem;
          }

          .admin-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
