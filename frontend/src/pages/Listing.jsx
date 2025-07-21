import React, { useEffect, useState } from 'react';

const MOCK_PROPERTIES = [
  {
    title: 'Modern Apartment in City Center',
    description: 'A beautiful 2-bedroom apartment located in the heart of the city.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Cozy Cottage',
    description: 'A charming cottage with a lovely garden.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Luxury Villa',
    description: 'Spacious villa with a pool and sea view.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
  },
];

const Listing = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('properties'));
    if (stored && stored.length > 0) {
      setProperties(stored);
    } else {
      setProperties(MOCK_PROPERTIES);
    }
  }, []);

  return (
    <div className="mx-auto mt-20 max-w-[1440px] p-8">
      <h1 className="text-3xl font-bold mb-4">Property Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            {property.image && (
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded mb-4" />
            )}
            <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
            <p className="mb-2">{property.description}</p>
            <div className="font-bold text-green-700">${property.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listing; 