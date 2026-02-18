import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'

const Home = () => {
  return (
    <div className='bg-gray-50'>
      <Navbar/>
      <HeroSection/>
       <CategoryCarousel/>
      <LatestJobs/>
      <Footer/> 
    </div>
  )
}
export default Home
