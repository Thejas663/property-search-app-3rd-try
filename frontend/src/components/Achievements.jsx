import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import {LiaCertificateSolid} from "react-icons/lia"
import About from './about';

const Achievements = () => {

    const [isVisible,SetIsVisible]=useState(false)

    const statistics=[
        {label:"happy clients",value:12},
        {label:"different cities",value:3},
        {label:"Projects completed",value:45}
    ]

    useEffect(()=>{
        const handleScroll=()=>{
            const aboutSection=document.getElementById("about")
            if(aboutSection){
                const top=aboutSection.getBoundingClientRect().top;
                const isVisible=top < window.innerHeight-100
                SetIsVisible(isVisible)
            }
        }
        window.addEventListener("scroll",handleScroll)
        return ()=>{
            window.removeEventListener("scroll",handleScroll)
        }
    },[])

  return (
    <section id='about'>
        {/* CONATINER */}
        <div>
            {/* LEFT SIDE */}
            <div>
                <h2>Our Achievements</h2>
                <p>We've helped thousands of users find their dream properties with ease, delivering over 10,000 successful listings and facilitating more than 5,000 direct inquiries in our first year alone. With real-time data our app has rapidly become a trusted platform for buyers, renters, and agents alike.</p>
                {/* STATISTIC CONTAINER */}
                <div>
                    {statistics.map((statistic,index)=>(
                        <div key={index}>
                            <div>
                                <CountUp start={isVisible?0:null} end={statistic.value} duration={10} delay={1}>
                                    {({countUpRef})=>(
                                        <h3 ref={countUpRef} className='text-5xl font-sans'></h3>
                                    )}
                                </CountUp>
                                <h4 className='regular-32'>k+</h4>
                            </div>
                            <p>{statistic.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Achievements