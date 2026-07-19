import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import {VscSettings} from "react-icons/vsc"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay} from 'swiper/modules';
import { PROPERTIES } from '../constant/data';
import Item from './Item';
import Map from './Map';
import { FaLocationArrow, FaSearch, FaTimes } from 'react-icons/fa';


// Haversine formula helper to compute great-circle distance between two points in km
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's mean radius in km
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

const Properties = () => {
  const [allProperties, setAllProperties] = useState(PROPERTIES);       // full list (never filtered)
  const [propertiesList, setPropertiesList] = useState(PROPERTIES);     // displayed list
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);       // { lat, lng } when a location is pinned
  const [radiusKm, setRadiusKm] = useState(10);                         // default 10 km
  const [searchingNearby, setSearchingNearby] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);          // true when showing filtered results

  // Recalculate distances for all properties whenever selectedLocation changes
  useEffect(() => {
    setPropertiesList((prevList) =>
      prevList.map((p) => {
        let distance = null;
        if (selectedLocation && p.latitude !== undefined && p.longitude !== undefined) {
          distance = calculateHaversineDistance(
            selectedLocation.lat,
            selectedLocation.lng,
            p.latitude,
            p.longitude
          );
        }
        return { ...p, distance };
      })
    );
  }, [selectedLocation]);

  // Load all properties on mount
  useEffect(() => {
    const fetchDBProperties = async () => {
      try {
        const response = await fetch('/api/properties/property');
        if (response.ok) {
          const data = await response.json();
          const formatted = (data.data || []).map((p) => ({
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
          const combined = [...formatted, ...PROPERTIES];
          setAllProperties(combined);
          
          // Apply initial distances if selectedLocation is already set
          const initialCalculated = combined.map((p) => {
            let distance = null;
            if (selectedLocation && p.latitude !== undefined && p.longitude !== undefined) {
              distance = calculateHaversineDistance(
                selectedLocation.lat,
                selectedLocation.lng,
                p.latitude,
                p.longitude
              );
            }
            return { ...p, distance };
          });
          setPropertiesList(initialCalculated);
        }
      } catch (err) {
        console.error("Failed to fetch properties from DB", err);
      }
    };
    fetchDBProperties();
  }, []);

  // ── Address autocomplete ─────────────────────────────────────────────
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
    setSelectedLocation({ lat, lng: lon });
  };

  // ── Geolocation ──────────────────────────────────────────────────────
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setMapCenter([lat, lon]);
          setMapZoom(13);
          setSelectedLocation({ lat, lng: lon });
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

  // ── Proximity search ─────────────────────────────────────────────────
  const handleSearchNearby = async () => {
    if (!selectedLocation) {
      alert("Please enter an address or use your location first.");
      return;
    }
    setSearchingNearby(true);
    try {
      const { lat, lng } = selectedLocation;
      const res = await fetch(`/api/properties/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.data || []).map((p) => {
          let distance = null;
          if (p.latitude !== undefined && p.longitude !== undefined) {
            distance = calculateHaversineDistance(lat, lng, p.latitude, p.longitude);
          }
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            image: p.image,
            city: p.city || 'Unknown',
            latitude: p.latitude,
            longitude: p.longitude,
            distance,
            facilities: {
              bedrooms: p.bedrooms || 0,
              bathrooms: p.bathrooms || 0,
              parkings: p.parkings || 0
            }
          };
        });
        setPropertiesList(formatted);
        setIsNearbyActive(true);
      } else {
        alert("Nearby search failed. Please try again.");
      }
    } catch (err) {
      console.error("Nearby search error", err);
      alert("Could not reach the server. Is the backend running?");
    } finally {
      setSearchingNearby(false);
    }
  };

  // ── Clear nearby filter ───────────────────────────────────────────────
  const handleClearNearby = () => {
    setPropertiesList(allProperties);
    setIsNearbyActive(false);
    setSelectedLocation(null);
    setSearchQuery('');
    setMapCenter(null);
    setMapZoom(null);
  };

  return (
    <section className='max-padd-container'>
        <div className='py-16 xl:py-28 rounded-3xl'>
            <span className='medium-18'>Your future Home awaits!</span>
            <h2 className='h2'>Find your dream here</h2>
            <div className='flexBetween mt-8 mb-6'>
                <h5>
                  <span className='font-bold'>
                    {isNearbyActive
                      ? `${propertiesList.length} properties within ${radiusKm} km`
                      : `Showing 1-${propertiesList.length}`}
                  </span>
                  {!isNearbyActive && ' properties'}
                </h5>
                <div className="flex items-center gap-2">
                  {isNearbyActive && (
                    <button
                      onClick={handleClearNearby}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-full px-4 py-1.5 border border-red-200 transition-colors cursor-pointer"
                    >
                      <FaTimes className="text-xs" /> Show All
                    </button>
                  )}
                  <Link to={"/"} className='bg-secondary text-white text-2xl rounded-md p-2 flexCenter'>
                    <VscSettings/>
                  </Link>
                </div>
            </div>

            {/* ── Row 1: Address search + Geolocation ── */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3 relative z-20">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search address, city, or zip code..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-200 rounded-full px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto z-30">
                    {suggestions.map((s) => (
                      <li
                        key={s.place_id}
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-0 transition-colors"
                      >
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={handleUseMyLocation}
                disabled={loadingLocation}
                className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 disabled:bg-gray-300 text-white font-semibold rounded-full px-6 py-3 shadow transition-colors cursor-pointer"
              >
                <FaLocationArrow className={loadingLocation ? "animate-spin" : ""} />
                {loadingLocation ? "Locating..." : "Use My Location"}
              </button>
            </div>

            {/* ── Row 2: Radius selector + Search Nearby ── */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-sm font-semibold text-gray-600">Radius:</span>
              {[5, 10, 20, 50].map((km) => (
                <button
                  key={km}
                  onClick={() => setRadiusKm(km)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    radiusKm === km
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary'
                  }`}
                >
                  {km} km
                </button>
              ))}
              <button
                onClick={handleSearchNearby}
                disabled={searchingNearby || !selectedLocation}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full px-6 py-2 shadow transition-colors cursor-pointer ml-auto"
              >
                <FaSearch />
                {searchingNearby ? "Searching..." : "Search Nearby"}
              </button>
            </div>

            {/* ── Location pin indicator ── */}
            {selectedLocation && !isNearbyActive && (
              <p className="text-sm text-green-600 font-medium mb-3">
                📍 Location pinned — click <strong>Search Nearby</strong> to find properties within {radiusKm} km.
              </p>
            )}
            {isNearbyActive && (
              <p className="text-sm text-blue-600 font-medium mb-3">
                🗺️ Showing <strong>{propertiesList.length}</strong> properties within <strong>{radiusKm} km</strong> of your selected location.
              </p>
            )}

            {/* Map showing property markers */}
            <Map properties={propertiesList} center={mapCenter} zoom={mapZoom} />

            {/* CONTAINER */}
            {propertiesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-2xl font-bold text-gray-400 mb-2">No properties found</p>
                <p className="text-gray-400 mb-6">No properties exist within {radiusKm} km of your location.</p>
                <button
                  onClick={handleClearNearby}
                  className="bg-secondary text-white font-semibold rounded-full px-8 py-3 hover:bg-secondary/90 transition-colors cursor-pointer"
                >
                  Show All Properties
                </button>
              </div>
            ) : (
              <Swiper
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                    600:{
                        slidesPerView:2,
                        spaceBetween:30,
                    },
                    1124:{
                        slidesPerView:3,
                        spaceBetween:30,
                    },
                    1300:{
                        slidesPerView:4,
                        spaceBetween:30,
                    }
                }}
                modules={[Autoplay]}
                className="h-[488px] md:h-[533px] xl:h-[422px] mt-5"
              >
                {propertiesList.map((property, idx) => (
                  <SwiperSlide key={property.id || `${property.title}-${idx}`}>
                    <Item property={property}/>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
        </div>
    </section>
  )
}

export default Properties