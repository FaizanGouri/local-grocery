import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Categories from '../components/Categories'
import Products from '../components/Products'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import AppDownload from '../components/AppDownload'


const Home = () => {
  return (
    <div>
        <Hero />
        <Features />
        <Categories />
        <Products />
        <HowItWorks />
        <Testimonials />
        <AppDownload />
    </div>
  )
}

export default Home