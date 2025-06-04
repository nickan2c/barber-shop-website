import Navigation from '@/components/Navigation';

const services = [
  {
    name: "Men's Haircut",
    description: "Professional haircut including neck shave",
    price: "£30",
    duration: "45 min"
  },
  {
    name: "Beard Trim",
    description: "Shape and trim your beard to perfection",
    price: "£20",
    duration: "30 min"
  },
  {
    name: "Hot Towel Shave",
    description: "Traditional straight razor shave with hot towel treatment",
    price: "£35",
    duration: "45 min"
  },
  {
    name: "Kids Haircut",
    description: "Haircut for children under 12",
    price: "£25",
    duration: "30 min"
  },
  {
    name: "Hair & Beard Combo",
    description: "Full haircut and beard grooming service",
    price: "£45",
    duration: "1 hour"
  },
  {
    name: "Senior's Cut",
    description: "Discounted haircut for seniors 65+",
    price: "£25",
    duration: "45 min"
  }
];

export default function Services() {
  return (
    <div className="main-layout">
      <Navigation />
      <main className="container">
        <h1 className="section-title">Our Services</h1>
        <div className="services-list">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p className="price">{service.price}</p>
              <p className="duration">{service.duration}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 