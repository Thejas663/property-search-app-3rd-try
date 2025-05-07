import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Achievements from '../components/Achievements'
import About from '../components/about'
import Properties from '../components/Properties'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <>
    <Header/>
    <main className='mx-auto max-w-[1440px] bg-gradient-to-r from-primary via-white to-white'>
      <Hero/>
      <Features/>
      <Achievements/>
      <Properties/>
      <About/>
      <Testimonials/>
    </main>
    </>
  )
}

export default Home