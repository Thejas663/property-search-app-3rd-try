import React from 'react'
import { Link } from 'react-router-dom'
import client1 from "../assets/client1.jpg"
import client2 from "../assets/client2.jpg"
import client3 from "../assets/client3.jpg"
import client4 from "../assets/client3.jpg"
import client5 from "../assets/client3.jpg"
import client6 from "../assets/client3.jpg"
import { FaStar } from 'react-icons/fa'

const Hero = () => {
  return (
    <section className='max-padd-container bg-hero'>
      <div>
        <h1>Discover your dream Property Today</h1>
        <p>makes finding your dream property easy! Search for houses, apartments, and commercial spaces.</p>
        {}
        <div>
          <div>
            <p><span>10% off</span>on all properties</p>
          </div>
          <Link to={"/listing"}>Explore</Link>
        </div>
        <div>
          <div>
            {/* CLIENT IMAGE */}
            <img src={client1} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <img src={client2} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <img src={client3} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <img src={client4} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <img src={client5} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <img src={client6} alt="" className="h-[46px] border-2 border-white shadow-sm rounded-full" />
            <div>210k+</div>
          </div>
          <div>people succesfully got their dream house</div>
        </div>
        <div>
          <div>
            <FaStar/>
            <FaStar/>
            <FaStar/>
            <FaStar/>
          </div>
          <div>127k<span>Excellent Reviews</span></div>
        </div>
      </div>
    </section>
  )
}

export default Hero