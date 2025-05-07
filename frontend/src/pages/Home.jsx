import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <>
    <Header/>
    <main className='mx-auto max-w-[1440px] bg-gradient-to-r from-primary via-white to-white'>
      <Hero/>
    </main>
    </>
  )
}

export default Home