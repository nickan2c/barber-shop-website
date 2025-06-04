'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useFirebase();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Classic Cuts
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/services" className="nav-link">
            Services
          </Link>
          <Link href="/book" className="nav-link">
            Book Appointment
          </Link>
          {user ? (
            <Link href="/account" className="nav-link">
              My Account
            </Link>
          ) : (
            <Link href="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 