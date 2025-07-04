import React from 'react'
import {Link} from "react-router-dom"
import {VscSettings} from "react-icons/vsc"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Autoplay} from 'swiper/modules';
import { PROPERTIES } from '../constant/data';
import Item from './item';


const Properties = () => {
  return (
    <section className='max-padd-container'>
        <div className='py-16 xl:py-28 rounded-3xl'>
            <span className='medium-18'>Your future Home awaits!</span>
            <h2 className='h2'>Find your dream here</h2>
            <div className='flexBetween mt-8 mb-6'>
                <h5><span className='font-bold'>Showing 1-9</span> out of 3k properties</h5>
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
        {PROPERTIES.slice(0,6).map((property)=>(
          <SwiperSlide key={property.title}>
            <Item property={property}/>
          </SwiperSlide>

        ))}
        
      </Swiper>
        </div>
    </section>
  )
}

export default Properties