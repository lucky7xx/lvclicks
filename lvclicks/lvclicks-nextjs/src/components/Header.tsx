'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav>
        <button
          className="mobile-menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className="logo">
          <Image
            src="/lv-logo.png"
            alt="LV Clicks"
            className="logo-img"
            width={120}
            height={60}
            priority
          />
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link href="#home" onClick={handleLinkClick}>Home</Link></li>
          <li><Link href="#services" onClick={handleLinkClick}>Services</Link></li>
          <li><Link href="#portfolio" onClick={handleLinkClick}>Portfolio</Link></li>
          <li><Link href="#about" onClick={handleLinkClick}>About</Link></li>
          <li><Link href="#contact" onClick={handleLinkClick}>Contact</Link></li>
        </ul>
      </nav>
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
