import Navigation from '@/components/Navigation';

export default function Booking() {
  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Book an Appointment</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-center text-gray-600 mb-8">
              Select a service, choose your preferred date and time, and book your appointment instantly.
            </p>
            
            {/* Calendar component will be added here */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Calendar booking system coming soon...
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Before You Book</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Please arrive 5 minutes before your appointment time</li>
                <li>• Cancellations must be made at least 24 hours in advance</li>
                <li>• We accept all major credit cards, cash, and mobile payments</li>
                <li>• Free parking is available on premises</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 