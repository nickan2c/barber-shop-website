'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { clientDb } from '../../lib/firebase';

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  price: string;
  status: string;
}

export default function AccountPage() {
  const { user } = useFirebase();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings for user:', user.uid);
        
        if (!clientDb) {
          throw new Error('Firestore is not initialized');
        }

        const bookingsRef = collection(clientDb, 'bookings');
        console.log('Created bookings collection reference');

        const q = query(
          bookingsRef,
          where('userId', '==', user.uid)
        );
        console.log('Created query');

        const querySnapshot = await getDocs(q);
        console.log('Got query snapshot, size:', querySnapshot.size);

        const bookingsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Booking data:', data);
          return {
            id: doc.id,
            ...data
          };
        }) as Booking[];

        console.log('Processed bookings:', bookingsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Detailed error fetching bookings:', err);
        if (err instanceof Error) {
          setError(`Error fetching bookings: ${err.message}`);
        } else {
          setError('Failed to fetch bookings. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

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
            <Link href="/account" className="nav-link">My Account</Link>
          </div>
        </div>
      </nav>

      <main className="container account-page">
        <h1 className="section-title">My Bookings</h1>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="btn btn-secondary mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
            <Link href="/book" className="btn btn-primary">
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.serviceName}</h3>
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p>
                    <strong>Date & Time:</strong> {formatDate(booking.date)}
                  </p>
                  <p>
                    <strong>Price:</strong> {booking.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="account-actions">
          <Link href="/book" className="btn btn-secondary">
            Book Another Appointment
          </Link>
        </div>
      </main>
    </div>
  );
} 