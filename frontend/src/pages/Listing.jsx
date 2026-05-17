import React, { useEffect, useState } from 'react';

const Listing = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/property');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Unable to load properties');
        }
        setProperties(data.data || []);
      } catch (err) {
        setError(err.message || 'Unable to load properties');
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="mx-auto mt-20 max-w-[1440px] p-8">
      <h1 className="text-3xl font-bold mb-4">Property Listings</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
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