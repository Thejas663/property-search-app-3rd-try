import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import {VscSettings} from "react-icons/vsc"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styl
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Autoplay} from 'swiper/modules';
import { PROPERTIES } from '../constant/data';
import Item from './Item';
import Map from './Map';
import { FaLocationArrow } from 'react-icons/fa';


const Properties = () => {
  const [propertiesList, setPropertiesList] = useState(PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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
          // Show DB-fetched properties first, followed by mock data
          setPropertiesList([...formatted, ...PROPERTIES]);
        }
      } catch (err) {
        console.error("Failed to fetch properties from DB", err);
      }
    };
    fetchDBProperties();
  }, []);

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

  return (
    <section className='max-padd-container'>
        <div className='py-16 xl:py-28 rounded-3xl'>
            <span className='medium-18'>Your future Home awaits!</span>
            <h2 className='h2'>Find your dream here</h2>
            <div className='flexBetween mt-8 mb-6'>
                <h5><span className='font-bold'>Showing 1-{propertiesList.length}</span> properties</h5>
                <Link to={"/"} className='bg-secondary text-white text-2xl rounded-md p-2 flexCenter'>
                <VscSettings/>
                </Link>
            </div>
            
            {/* Search and Geolocation Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 relative z-20">
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

            {/* Map showing all property markers */}
            <Map properties={propertiesList} center={mapCenter} zoom={mapZoom} />

            {/* CONTAINER */}
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
        {propertiesList.map((property, idx)=>(
          <SwiperSlide key={property.id || `${property.title}-${idx}`}>
            <Item property={property}/>
          </SwiperSlide>

        ))}
        
      </Swiper>
        </div>
    </section>
  )
}

export default Properties