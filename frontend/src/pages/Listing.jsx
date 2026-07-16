import React, { useEffect, useState } from 'react';
import Item from '../components/Item';

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
        
        // Map database properties to the structure expected by the Item card component
        const formatted = (data.data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          image: p.image,
          city: p.city || 'Unknown',
          facilities: {
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            parkings: p.parkings || 0
          }
        }));

        setProperties(formatted);
      } catch (err) {
        setError(err.message || 'Unable to load properties');
      }
    };

    fetchProperties();
  }, []);

  return (
    <main className="mx-auto max-w-[1440px] bg-gradient-to-r from-primary via-white to-white min-h-screen pt-28 pb-16">
      <section className="max-padd-container">
        <span className="medium-18">Explore our catalog</span>
        <h2 className="h2">Property Listings</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {properties.map((property) => (
            <Item key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Listing; 