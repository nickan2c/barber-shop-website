import Navigation from '@/components/Navigation';

const services = [
  {
    name: "Men's Haircut",
    description: "Professional haircut including neck shave",
    price: "$30",
    duration: "45 min"
  },
  {
    name: "Beard Trim",
    description: "Shape and trim your beard to perfection",
    price: "$20",
    duration: "30 min"
  },
  {
    name: "Hot Towel Shave",
    description: "Traditional straight razor shave with hot towel treatment",
    price: "$35",
    duration: "45 min"
  },
  {
    name: "Kids Haircut",
    description: "Haircut for children under 12",
    price: "$25",
    duration: "30 min"
  },
  {
    name: "Hair & Beard Combo",
    description: "Full haircut and beard grooming service",
    price: "$45",
    duration: "1 hour"
  },
  {
    name: "Senior's Cut",
    description: "Discounted haircut for seniors 65+",
    price: "$25",
    duration: "45 min"
  }
];

export default function Services() {
  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-lg text-gray-900">{service.price}</span>
                <span className="text-gray-500">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 