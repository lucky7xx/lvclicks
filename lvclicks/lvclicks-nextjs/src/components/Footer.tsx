import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <Image
                src="/lv-logo.png"
                alt="LV Clicks"
                className="footer-logo-img"
                width={120}
                height={60}
              />
            </div>
            <h3>LV Clicks</h3>
            <p className="footer-description">
              Professional photography and videography services that capture your precious moments
              with artistic excellence and creative vision.
            </p>
          </div>

          {/* Social Section */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a
                href="https://instagram.com/lv_clicks_"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram - @lv_clicks_"
              >
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a
                href="https://www.facebook.com/lensvideoproduction/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook - Lens Video Productions"
              >
                <i className="fab fa-facebook-f fa-2x"></i>
              </a>
              <a
                href="https://youtube.com/@lv_clicks"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="YouTube - @lv_clicks"
              >
                <i className="fab fa-youtube fa-2x"></i>
              </a>
              <a
                href="https://wa.me/919428012269"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp fa-2x"></i>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3>Get In Touch</h3>
            <div className="footer-contact">
              <p className="footer-contact-item">📸 Professional Photography & Videography</p>
              <p className="footer-contact-item">📍 Gujarat, India</p>
              <p className="footer-contact-item">✨ Creating memories that last a lifetime</p>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-text">
            &copy; 2025 LV Clicks - Lens Video Productions. All rights reserved. Crafted with ❤️ by{' '}
            <a
              href="https://mystiq.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="mystiq-link"
            >
              mystiq.tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
