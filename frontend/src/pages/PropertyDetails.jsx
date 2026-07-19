import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSchool, FaHospital, FaSubway, FaBed, FaBath, FaCar, FaArrowLeft } from 'react-icons/fa';
import { PROPERTIES } from '../constant/data';

// Fix for default marker icons in Leaflet with Vite/React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Haversine formula to compute distance in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Map View Panning Component
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  // Fetch individual property
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // Fetch all properties to locate the matching ID
        const response = await fetch('/api/properties/property');
        let foundProperty = null;

        if (response.ok) {
          const resData = await response.json();
          const dbList = (resData.data || []).map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            image: p.image,
            city: p.city || 'Unknown',
            latitude: p.latitude,
            longitude: p.longitude,
            facilities: {
              bedrooms: p.bedrooms || 0,
              bathrooms: p.bathrooms || 0,
              parkings: p.parkings || 0
            }
          }));
          foundProperty = dbList.find((p) => p.id === id);
        }

        // Fallback to mock PROPERTIES data
        if (!foundProperty) {
          foundProperty = PROPERTIES.find((p) => p.id === id || String(p.id) === String(id));
        }

        setProperty(foundProperty);
      } catch (err) {
        console.error('Error fetching property detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Query nearby amenities using Overpass API with session cache
  useEffect(() => {
    if (!property || typeof property.latitude !== 'number' || typeof property.longitude !== 'number') return;

    const fetchAmenities = async () => {
      const lat = property.latitude;
      const lon = property.longitude;
      const cacheKey = `amenities_${lat.toFixed(5)}_${lon.toFixed(5)}`;
      
      // Check session cache first
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setAmenities(JSON.parse(cachedData));
        return;
      }

      setLoadingAmenities(true);
      try {
        // Query schools, hospitals, and subway/metro stations within 2km
        const query = `[out:json][timeout:20];(node(around:2000,${lat},${lon})[amenity~"school|hospital|university|college|clinic"];node(around:2000,${lat},${lon})[railway~"station|subway_station"];node(around:2000,${lat},${lon})[amenity="bus_station"];);out body;`;
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        
        if (res.ok) {
          const data = await res.json();
          const parsed = (data.elements || []).map((el) => {
            const dist = calculateDistance(lat, lon, el.lat, el.lon);
            let category = 'Transit';
            if (['school', 'university', 'college'].includes(el.tags.amenity)) {
              category = 'School';
            } else if (['hospital', 'clinic'].includes(el.tags.amenity)) {
              category = 'Hospital';
            }
            return {
              id: el.id,
              name: el.tags.name || el.tags.amenity || el.tags.railway || 'Unnamed Station',
              category,
              distance: dist,
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10); // top 10 closest amenities

          setAmenities(parsed);
          sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        }
      } catch (err) {
        console.error('Overpass API query failed', err);
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, [property]);

  if (loading) {
    return (
      <div className="flexCenter min-h-screen pt-28">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-28">
        <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
        <Link to="/" className="mt-4 bg-secondary text-white px-6 py-2 rounded-full font-semibold">
          Back to Home
        </Link>
      </div>
    );
  }

  const getAmenityIcon = (category) => {
    switch (category) {
      case 'School':
        return <FaSchool className="text-blue-500 text-lg" />;
      case 'Hospital':
        return <FaHospital className="text-red-500 text-lg" />;
      default:
        return <FaSubway className="text-amber-500 text-lg" />;
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-padd-container">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary font-medium mb-6 transition-colors">
          <FaArrowLeft /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Section: Details */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-[400px] object-cover rounded-2xl shadow-inner mb-6"
            />
            
            <div className="flexBetween mb-4">
              <span className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1 rounded-full uppercase">
                {property.city}
              </span>
              <h2 className="text-3xl font-bold text-gray-900">${property.price}.00</h2>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{property.title}</h1>
            
            {/* Facility Badges */}
            <div className="flex gap-4 border-y border-gray-100 py-4 mb-6">
              <div className="flex items-center gap-2 font-medium text-gray-600">
                <FaBed className="text-secondary text-lg" />
                <span>{property.facilities?.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-gray-600">
                <FaBath className="text-secondary text-lg" />
                <span>{property.facilities?.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-gray-600">
                <FaCar className="text-secondary text-lg" />
                <span>{property.facilities?.parkings} Parkings</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Right Section: Map & Amenities */}
          <div className="flex flex-col gap-6">
            {/* Map Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Location Map</h3>
              {typeof property.latitude === 'number' && typeof property.longitude === 'number' ? (
                <div className="w-full h-[240px] rounded-2xl overflow-hidden shadow border border-gray-200 relative z-10">
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={14}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <ChangeMapView center={[property.latitude, property.longitude]} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[property.latitude, property.longitude]} />
                  </MapContainer>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl h-[240px] flexCenter text-gray-400">
                  No map coordinates available.
                </div>
              )}
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nearby Places (2km)</h3>
              
              {loadingAmenities ? (
                <div className="flexCenter py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                </div>
              ) : amenities.length === 0 ? (
                <p className="text-gray-400 text-sm">No nearby schools, hospitals, or transit stations found.</p>
              ) : (
                <div className="space-y-4">
                  {amenities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-gray-50 rounded-xl shrink-0">
                          {getAmenityIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                        {item.distance < 1 
                          ? `${(item.distance * 1000).toFixed(0)} m` 
                          : `${item.distance.toFixed(1)} km`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;
