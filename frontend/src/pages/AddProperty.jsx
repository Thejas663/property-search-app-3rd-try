import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationArrow } from 'react-icons/fa';

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

// Programmatic map panning helper component
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Component to handle map clicks and callback the parent
const MapEventsHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const AddProperty = () => {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    image: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    parkings: '',
    latitude: '',
    longitude: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMapClick = (latlng) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (s) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setMapCenter([lat, lon]);
    setMapZoom(13);
    setSearchQuery(s.display_name);
    setSuggestions([]);
    setForm((prevForm) => ({
      ...prevForm,
      latitude: lat,
      longitude: lon,
    }));
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setMapCenter([lat, lon]);
          setMapZoom(13);
          setForm((prevForm) => ({
            ...prevForm,
            latitude: lat,
            longitude: lon,
          }));
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Error getting location", err);
          alert("Could not retrieve your location. Make sure location permissions are enabled.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.latitude === '' || form.longitude === '') {
      setError('Please select a location on the map by clicking it.');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    if (!currentUser || !token) {
      setError('You must be logged in to add a property.');
      return;
    }

    try {
      const response = await fetch('/api/properties/property', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...form, 
          price: parseFloat(form.price),
          bedrooms: parseInt(form.bedrooms || '0', 10),
          bathrooms: parseInt(form.bathrooms || '0', 10),
          parkings: parseInt(form.parkings || '0', 10),
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude)
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Property could not be added');
      }

      setMessage('Property added successfully!');
      setForm({ 
        title: '', 
        description: '', 
        price: '', 
        image: '',
        city: '',
        bedrooms: '',
        bathrooms: '',
        parkings: '',
        latitude: '',
        longitude: ''
      });
      setSearchQuery('');
    } catch (err) {
      setError(err.message || 'Property creation failed');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-[800px] p-8">
      <h1 className="text-3xl font-bold mb-4">Add Property</h1>
      {message && <div className="text-green-600 font-semibold mb-4">{message}</div>}
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Click to Select Map */}
        <div>
          {/* Autocomplete Search Input */}
          <div className="relative mb-3 z-20">
            <input
              type="text"
              placeholder="Search address or city..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-30">
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 last:border-0 transition-colors"
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-700">
              Select property location *
            </label>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={loadingLocation}
              className="flex items-center gap-1 bg-green-50 hover:bg-green-100 disabled:bg-gray-100 text-green-700 text-xs font-semibold rounded-lg px-3 py-1.5 border border-green-200 transition-colors cursor-pointer"
            >
              <FaLocationArrow className={loadingLocation ? "animate-spin" : ""} />
              {loadingLocation ? "Locating..." : "Use My Location"}
            </button>
          </div>

          <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow border border-gray-200 relative z-10">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <ChangeMapView center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEventsHandler onClick={handleMapClick} />
              {form.latitude !== '' && form.longitude !== '' && (
                <Marker position={[form.latitude, form.longitude]} />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City (e.g. San Francisco)"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
            rows={3}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              min="0"
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              min="0"
            />
            <input
              type="number"
              name="parkings"
              placeholder="Parkings"
              value={form.parkings}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              min="0"
            />
          </div>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              className="border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
              required
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              className="border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
              required
            />
          </div>

          <button type="submit" className="bg-green-500 hover:bg-green-600 transition-colors text-white font-bold p-3 rounded-lg shadow-md mt-2">
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;