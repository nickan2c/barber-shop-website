'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/contexts/FirebaseContext';
import BookingCalendar from '@/components/BookingCalendar';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import BookingForm from '@/components/BookingForm';
import { createBooking, checkTimeSlotAvailability } from '@/services/bookingService';

const services = [
  { id: 'haircut', name: 'Classic Haircut', price: 30, duration: 30 },
  { id: 'haircut-beard', name: 'Haircut & Beard Trim', price: 45, duration: 45 },
  { id: 'beard-trim', name: 'Beard Trim', price: 20, duration: 15 },
  { id: 'kids-haircut', name: 'Kids Haircut', price: 25, duration: 30 },
];

export default function BookingPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBookingSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Please complete all booking details');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert selected time to Date object
      const [hours, minutes] = selectedTime.split(':');
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Check if the time slot is still available
      const isAvailable = await checkTimeSlotAvailability(bookingDate);
      if (!isAvailable) {
        setError('This time slot is no longer available. Please select another time.');
        setStep(3);
        return;
      }

      // Create the booking
      await createBooking({
        userId: user?.uid || 'guest', // Allow guest bookings
        serviceId: selectedService,
        date: bookingDate,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      });

      // Redirect to confirmation page
      router.push('/booking/confirmation');
    } catch (error) {
      console.error('Booking error:', error);
      setError('An error occurred while creating your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-gray-600">Schedule your visit to Classic Cuts Barber Shop</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4 md:space-x-8">
            {[
              'Choose Service',
              'Select Date',
              'Pick Time',
              'Your Details',
            ].map((stepName, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    index + 1 < step ? 'w-32' : 'w-24'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${
                        step > index + 1
                          ? 'bg-green-500 text-white'
                          : step === index + 1
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {step > index + 1 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden md:block
                      ${
                        step > index + 1
                          ? 'text-green-500'
                          : step === index + 1
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                  >
                    {stepName}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`hidden md:block h-0.5 w-12 mx-2
                      ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Step 1: Service Selection */}
          <div className={step === 1 ? 'block p-8' : 'hidden'}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="p-6 border rounded-lg hover:border-gray-900 transition-all hover:shadow-md text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-gray-600">{service.duration} mins</p>
                    <p className="text-lg font-medium text-gray-900">${service.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Date Selection */}
          {step >= 2 && selectedService && (
            <div className={step === 2 ? 'block p-8' : 'hidden'}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a Date</h2>
              <div className="flex justify-center">
                <BookingCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step >= 3 && selectedDate && (
            <div className={step === 3 ? 'block p-8' : 'hidden'}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a Time</h2>
              <TimeSlotPicker selectedTime={selectedTime} onTimeSelect={handleTimeSelect} />
            </div>
          )}

          {/* Step 4: Customer Details */}
          {step === 4 && selectedService && selectedDate && selectedTime && (
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enter Your Details</h2>
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedService={
                  services.find((s) => s.id === selectedService)?.name || ''
                }
                onSubmit={handleBookingSubmit}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              )}
              <div className="text-sm text-gray-500">
                Step {step} of 4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <svg
                className="animate-spin h-5 w-5 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-900">Creating your booking...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 