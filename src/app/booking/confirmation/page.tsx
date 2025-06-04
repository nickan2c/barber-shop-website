'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { user } = useFirebase();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for booking with Classic Cuts Barber Shop. We have sent a confirmation
          email with your booking details.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            View My Bookings
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Arrive 5 minutes before your scheduled time
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              If you need to cancel or reschedule, please do so at least 24 hours in advance
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Feel free to call us if you have any questions before your appointment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 