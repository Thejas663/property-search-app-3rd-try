import React from 'react'
import about1 from "../assets/about1.png"
import about2 from "../assets/about2.png"
import { FaScreenpal,FaUpDown } from 'react-icons/fa6'
import { FaEnvelope,FaInbox,FaList,FaMap,FaMapMarkedAlt,FaUser } from 'react-icons/fa'


const About = () => {
  return (
    <section className='max-padd-container pb-16 xl:pb-28'>
      <div className='flex items-center flex-col lg:flex-row gap-12'>
        {/* IMAGE-LEFT SIDE */}
        <div className='flex-1'>
          <div className='relative'>
            <img src={about1} alt="AboutImg" className='rounded-3xl'/>
            <span className='absolute top-8 left-8 bg-white px-2 rounded-full medium-14'>San Francisco</span>
          </div>
        </div>
        {/* INFO-RIGHT SIDE */}
        <div className='flex-1'>
          <h2 className='h2'>Empowering you to find your dream Home,Effortlessly</h2>
          <p>From understanding your needs and preferences to navigating the market and securing your ideal property, we provide expert guidance and support every step of the way.</p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaScreenpal className='text-secondary'/>
              <p>Virtual property Tours and viewings</p>
            </div>
            <div className='flex gap-3'>
              <FaUpDown className='text-secondary'/>
              <p>Real time market price update</p>
            </div>
            <div className='flex gap-3'>
              <FaMap className='text-secondary'/>
              <p>Interactive floor plans and maps</p>
            </div>
            <div className='flex gap-3'>
              <FaMapMarkedAlt className='text-secondary'/>
              <p>Access to off market properties</p>
            </div>
            <div className='flex gap-3'>
              <FaEnvelope className='text-secondary'/>
              <p>Direct messaging with agents and owners</p>
            </div>
          </div>
        </div>
      </div>
      {/* SECOND CONTAINER */}
      <div className='flex items-center flex-col lg:flex-row gap-12 mt-36'>
        {/* INFO-LEFT SIDE */}
        <div className='flex-1'>
          <h2 className='h2'>Simplyfying your real estate journey every step of the way.</h2>
          <p>From understanding your needs and preferences to navigating the market and securing your ideal property, we provide expert guidance and support every step of the way.</p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaList className='text-secondary'/>
              <p>In-app scheduling for property viewings.</p>
            </div>
            <div className='flex gap-3'>
              <FaUpDown className='text-secondary'/>
              <p>Real time market price update</p>
            </div>
            <div className='flex gap-3'>
              <FaInbox className='text-secondary'/>
              <p>User friendly interface for smooth navigation</p>
            </div>
            <div className='flex gap-3'>
              <FaUser className='text-secondary'/>
              <p>Detailed agent and realtor profiles</p>
            </div>
            <div className='flex gap-3'>
              <FaMapMarkedAlt className='text-secondary'/>
              <p>Access to off market prices</p>
            </div>
          </div>
        </div>
        {/* IMAGE-LEFT SIDE */}
        <div className='flex-1'>
          <div className='relative flex justify-end'>
            <img src={about2} alt="AboutImg" className='rounded-3xl'/>
            <span className='absolute top-8 right-8 bg-white px-2 rounded-full medium-14'>Golden Coast</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About