'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Calendar from 'react-calendar';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, getDocs, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { clientDb, isFirebaseInitialized } from '../../lib/firebase';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

const services: Service[] = [
  { id: 'gents-cut', name: "Gentleman's Cut", price: '£25', duration: '30' },
  { id: 'beard-trim', name: 'Beard Trim', price: '£15', duration: '20' },
  { id: 'full-service', name: 'Full Service', price: '£35', duration: '45' },
];

const generateTimeSlots = () => {
  const slots = [];
  const start = 9; // 9 AM
  const end = 19; // 7 PM

  for (let hour = start; hour < end; hour++) {
    // Format hours to always have 2 digits
    const formattedHour = hour.toString().padStart(2, '0');
    slots.push(`${formattedHour}:00`);
    slots.push(`${formattedHour}:30`);
  }

  return slots;
};

export default function BookingPage() {
  const { user } = useFirebase();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check if a date is in the past
  const isPastDate = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Function to check if a time slot is in the past
  const isPastTime = (time: string) => {
    if (!selectedDate) return true;
    
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime < new Date();
  };

  // Fetch booked slots for the selected date
  const fetchBookedSlots = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        console.log('No user found - redirecting to login');
        throw new Error('Please log in to view available time slots.');
      }

      console.log('Starting fetchBookedSlots with user:', {
        uid: user.uid,
        email: user.email
      });

      if (!isFirebaseInitialized()) {
        console.error('Firebase not initialized:', {
          user: !!user,
          date: date.toISOString()
        });
        throw new Error('Unable to connect to the booking system. Please try refreshing the page.');
      }

      if (!clientDb) {
        console.error('Firestore instance not available');
        throw new Error('Database connection not available. Please try again in a few moments.');
      }

      // Create collection reference
      const bookingsRef = collection(clientDb, 'bookings');
      console.log('Attempting to access bookings collection:', bookingsRef.path);

      // Test write access
      try {
        console.log('Testing write access...');
        const testBooking = {
          userId: user.uid,
          date: new Date().toISOString(),
          serviceName: 'TEST',
          status: 'test',
          createdAt: new Date().toISOString()
        };
        
        const testDoc = await addDoc(bookingsRef, testBooking);
        console.log('Write test successful - created document:', testDoc.id);
        
        await deleteDoc(testDoc);
        console.log('Write test cleanup successful');
      } catch (writeError: any) {
        console.error('Write access test failed:', writeError);
        throw new Error(`Database write access failed: ${writeError.message}`);
      }

      // Test read access
      try {
        console.log('Testing read access...');
        const testQuery = query(bookingsRef, limit(1));
        const testSnapshot = await getDocs(testQuery);
        console.log('Read test successful - found documents:', testSnapshot.size);
      } catch (readError: any) {
        console.error('Read access test failed:', readError);
        throw new Error(`Database read access failed: ${readError.message}`);
      }

      // If we get here, both read and write access are working
      console.log('Access tests passed, proceeding with date query');

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log('Querying bookings for date range:', {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      });

      const q = query(
        bookingsRef,
        where('date', '>=', startOfDay.toISOString()),
        where('date', '<=', endOfDay.toISOString())
      );

      const querySnapshot = await getDocs(q);
      console.log('Date query successful, processing results:', {
        totalBookings: querySnapshot.size,
        date: date.toISOString()
      });

      const bookedTimes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Processing booking:', {
          id: doc.id,
          date: data.date,
          userId: data.userId
        });
        const bookingDate = new Date(data.date);
        return `${bookingDate.getHours().toString().padStart(2, '0')}:${bookingDate.getMinutes().toString().padStart(2, '0')}`;
      });

      // Generate all possible time slots
      const allSlots = generateTimeSlots();
      
      // Filter out booked slots and past times
      const now = new Date();
      const availableSlots = allSlots.filter(slot => {
        // Check if slot is not booked
        if (bookedTimes.includes(slot)) return false;

        // Check if slot is not in the past for today
        if (date.getDate() === now.getDate() && 
            date.getMonth() === now.getMonth() && 
            date.getFullYear() === now.getFullYear()) {
          const [hours, minutes] = slot.split(':').map(Number);
          const slotTime = new Date(date);
          slotTime.setHours(hours, minutes, 0, 0);
          return slotTime > now;
        }

        return true;
      });
      
      setAvailableTimeSlots(availableSlots);
    } catch (err) {
      console.error('Error in fetchBookedSlots:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate]);

  const handleDateSelect = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null); // Reset time selection when date changes
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Please select all booking details');
      return;
    }

    try {
      setLoading(true);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(hours, minutes, 0, 0);

      const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: bookingDate.toISOString(),
        price: selectedService.price,
        duration: selectedService.duration,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const bookingsRef = collection(clientDb, 'bookings');
      await addDoc(bookingsRef, bookingData);

      router.push('/account');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <main className="container booking-page">
        <h1 className="section-title">Book Your Appointment</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-grid">
          <section className="booking-section">
            <h2>Select Service</h2>
            <div className="services-list">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <h3>{service.name}</h3>
                  <p className="price">{service.price}</p>
                  <p className="duration">{service.duration} mins</p>
                </div>
              ))}
            </div>
          </section>

          <section className="booking-section">
            <h2>Select Date</h2>
            <Calendar
              onChange={handleDateSelect}
              value={selectedDate}
              minDate={new Date()}
              tileDisabled={({ date }) => isPastDate({ date })}
              className="calendar"
            />
          </section>

          {selectedDate && (
            <section className="booking-section">
              <h2>Select Time</h2>
              {loading ? (
                <div className="loading-spinner">Loading available times...</div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="no-slots-message">
                  <p>No available time slots for this date.</p>
                  <p>Please select a different date.</p>
                </div>
              ) : (
                <div className="time-slots">
                  {availableTimeSlots.map((time) => {
                    const isDisabled = isPastTime(time);
                    return (
                      <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isDisabled}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>

        {selectedService && selectedDate && selectedTime && (
          <div className="booking-summary">
            <h2>Booking Summary</h2>
            <p><strong>Service:</strong> {selectedService.name}</p>
            <p><strong>Price:</strong> {selectedService.price}</p>
            <p><strong>Duration:</strong> {selectedService.duration} mins</p>
            <p><strong>Date:</strong> {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              Confirm Booking
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 