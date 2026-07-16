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


const Properties = () => {
  const [propertiesList, setPropertiesList] = useState(PROPERTIES);

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