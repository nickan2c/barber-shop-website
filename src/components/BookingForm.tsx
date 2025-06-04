'use client';

import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  selectedService: string;
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

export default function BookingForm({
  selectedDate,
  selectedTime,
  selectedService,
  onSubmit,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    onSubmit(formData);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getInputError = (field: keyof typeof formData) => {
    if (!touched[field]) return '';
    if (!formData[field]) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    return '';
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className={`block w-full px-4 py-3 rounded-lg border ${
                getInputError('name') 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-gray-500 focus:ring-gray-500'
              } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 text-gray-900`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleBlur('name')}
            />
            {getInputError('name') && (
              <p className="mt-1 text-sm text-red-600">{getInputError('name')}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="john@example.com"
              className={`block w-full px-4 py-3 rounded-lg border ${
                getInputError('email')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-gray-500 focus:ring-gray-500'
              } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 text-gray-900`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
            />
            {getInputError('email') && (
              <p className="mt-1 text-sm text-red-600">{getInputError('email')}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="(123) 456-7890"
              className={`block w-full px-4 py-3 rounded-lg border ${
                getInputError('phone')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-gray-500 focus:ring-gray-500'
              } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 text-gray-900`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              onBlur={() => handleBlur('phone')}
            />
            {getInputError('phone') && (
              <p className="mt-1 text-sm text-red-600">{getInputError('phone')}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">Service</dt>
              <dd className="text-sm font-medium text-gray-900">{selectedService}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">Date</dt>
              <dd className="text-sm font-medium text-gray-900">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">Time</dt>
              <dd className="text-sm font-medium text-gray-900">{selectedTime}</dd>
            </div>
          </dl>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg text-sm font-medium 
            hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 
            transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!formData.name || !formData.email || !formData.phone}
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
} 