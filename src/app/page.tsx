import Navigation from '@/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Classic Cuts Barber Shop</h1>
          <p className="text-xl mb-8">Where Style Meets Tradition</p>
          <Link
            href="/booking"
            className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Welcome to Classic Cuts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Expert Barbers</h3>
                <p>Our skilled team brings years of experience to every cut</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Premium Service</h3>
                <p>Enjoy a luxurious grooming experience in our modern facility</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
                <p>Book your appointment online with our convenient scheduling system</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Us</h2>
          <div className="space-y-4">
            <p className="text-lg">123 Barber Street</p>
            <p className="text-lg">City, State 12345</p>
            <p className="text-lg">Phone: (555) 123-4567</p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
              <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
              <p>Saturday: 9:00 AM - 5:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
