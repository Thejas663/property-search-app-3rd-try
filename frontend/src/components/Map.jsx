import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSchool, FaHospital, FaBus, FaUtensils } from 'react-icons/fa';

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

// Amenities Sub-component
const AmenitiesList = ({ lat, lon }) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const query = `[out:json][timeout:15];(node(around:1500,${lat},${lon})[amenity~"school|hospital|restaurant|cafe|bus_station|subway_station"];);out body;`;
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const parsed = (data.elements || []).map((el) => {
            const distance = calculateDistance(lat, lon, el.lat, el.lon);
            return {
              id: el.id,
              name: el.tags.name || el.tags.amenity || 'Unnamed',
              type: el.tags.amenity,
              distance,
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5); // top 5 nearest
          setAmenities(parsed);
        }
      } catch (err) {
        console.error("Overpass API failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, [lat, lon]);

  const getAmenityIcon = (type) => {
    if (['school', 'kindergarten', 'university', 'college'].includes(type)) return <FaSchool className="text-blue-500" />;
    if (['hospital', 'clinic', 'pharmacy', 'dentist'].includes(type)) return <FaHospital className="text-red-500" />;
    if (['bus_station', 'subway_station', 'transit_station'].includes(type)) return <FaBus className="text-amber-500" />;
    return <FaUtensils className="text-emerald-500" />;
  };

  if (loading) return <div className="text-[10px] text-gray-400 mt-2">Loading nearby amenities...</div>;
  if (amenities.length === 0) return <div className="text-[10px] text-gray-400 mt-2">No amenities found within 1.5km.</div>;

  return (
    <div className="mt-3 border-t border-gray-100 pt-2 w-[180px]">
      <h5 className="font-semibold text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Nearby Amenities</h5>
      <ul className="space-y-1 p-0 m-0 list-none">
        {amenities.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-1 text-[11px] text-gray-700">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="shrink-0">{getAmenityIcon(item.type)}</span>
              <span className="truncate" title={item.name}>{item.name}</span>
            </div>
            <span className="text-gray-400 font-medium shrink-0 text-[10px]">{(item.distance * 1000).toFixed(0)}m</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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

const Map = ({ properties, center, zoom }) => {
  // Filter out properties that don't have valid coordinates
  const validProperties = properties.filter(
    (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
  );

  // Set default center coordinates
  const defaultCenter =
    validProperties.length > 0
      ? [validProperties[0].latitude, validProperties[0].longitude]
      : [20.5937, 78.9629]; // Default coordinate if no properties exist

  const zoomLevel = validProperties.length > 0 ? 12 : 5;

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 my-8 relative z-10">
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView center={center || defaultCenter} zoom={zoom || zoomLevel} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProperties.map((property) => (
          <Marker
            key={property.id || property.title}
            position={[property.latitude, property.longitude]}
          >
            <Popup>
              <div className="p-1 font-sans">
                <h4 className="font-bold text-sm text-gray-800 m-0 mb-1">{property.title}</h4>
                <p className="text-xs text-gray-600 m-0 mb-1">City: {property.city}</p>
                <p className="text-sm font-semibold text-secondary m-0">${property.price}k</p>
                
                {/* Dynamically Loaded Amenities */}
                <AmenitiesList lat={property.latitude} lon={property.longitude} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
