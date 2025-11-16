import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Capturing Moments,<br />Creating Memories</h1>
        <p className="hero-tagline">Professional Photography & Videography</p>
        <p>
          Every frame tells a story. We specialize in turning your precious moments into timeless
          masterpieces through the art of photography and videography. Follow us on Instagram{' '}
          <a
            href="https://instagram.com/lv_clicks_"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}
          >
            @lv_clicks_
          </a>
        </p>
        <div className="cta-buttons">
          <Link href="#portfolio" className="cta-button">View Portfolio</Link>
          <Link href="#contact" className="cta-button cta-button-outline">Get in Touch</Link>
        </div>
      </div>
    </section>
  );
}
