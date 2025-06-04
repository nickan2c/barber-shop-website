'use client';

import Link from 'next/link';
import { useFirebase } from '../contexts/FirebaseContext';

export default function Home() {
  const { user } = useFirebase();

  return (
    <div className="main-layout">
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            Classic Cuts
          </Link>
          <div className="nav-links">
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/book" className="nav-link">Book Now</Link>
            {user ? (
              <Link href="/account" className="nav-link">My Account</Link>
            ) : (
              <Link href="/login" className="nav-link">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Classic Cuts Barbershop</h1>
          <p className="hero-subtitle">Experience the finest in traditional grooming</p>
          <div className="hero-buttons">
            <Link href="/book" className="btn btn-primary">
              Book Now
            </Link>
            {user && (
              <Link href="/account" className="btn btn-secondary hero-secondary-btn">
                View My Bookings
              </Link>
            )}
          </div>
        </div>
      </section>

      <main>
        <section className="container section">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features">
            <div className="feature">
              <h3>Expert Barbers</h3>
              <p>Our skilled team brings years of experience and expertise to every cut.</p>
            </div>
            <div className="feature">
              <h3>Classic & Modern Styles</h3>
              <p>From traditional cuts to contemporary trends, we do it all.</p>
            </div>
            <div className="feature">
              <h3>Premium Experience</h3>
              <p>Enjoy complimentary beverages and a relaxing atmosphere.</p>
            </div>
          </div>
        </section>

        <section className="visit-us">
          <div className="container">
            <h2 className="section-title">Visit Us</h2>
            <div className="contact-info">
              <p>123 Barber Street, London, UK</p>
              <p>Phone: +44 20 1234 5678</p>
              <p>Email: info@classiccuts.uk</p>
            </div>
            <div className="hours">
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
              <p>Saturday: 9:00 AM - 6:00 PM</p>
              <p>Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Classic Cuts Barbershop. All rights reserved.</p>
      </footer>
    </div>
  );
}
