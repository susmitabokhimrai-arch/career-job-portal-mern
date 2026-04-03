import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RecommendedJobs from './Recommendedjobs'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
    if (user?.role === 'admin') {
      navigate("/admin/manage-recruiter");
    }
  }, []);
  return (
    <div className='bg-gray-50'>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      {user?.role === 'student' && (  // only show for students
        <div className="mt-10 px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Jobs for You</h2>
          <RecommendedJobs />
        </div>
      )}
      <Footer />
    </div>
  )
}
export default Home
