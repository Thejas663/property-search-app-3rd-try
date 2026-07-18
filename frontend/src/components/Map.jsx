import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const Map = ({ properties }) => {
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
        center={defaultCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
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
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
