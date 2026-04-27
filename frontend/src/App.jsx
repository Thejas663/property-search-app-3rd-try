import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from "./components/Footer"
import Login from './components/Login'
import Register from './components/Register'
import Listing from './pages/Listing'
import Contact from './pages/Contact'
import AddProperty from './pages/AddProperty'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
