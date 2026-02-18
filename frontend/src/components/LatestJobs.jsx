import React from 'react'
import LatestJobCards from './LatestJobCards';

const randomjobs = [1,2,3,4,5,6,7,8];
const LatestJobs = () => {
  return (
    <div className='max-w-4xl mx-auto my-20'>
      <h1 className='text-4xl font-bold text-center text-gray-9oo mb-12'><span className='text-[#6A38C2]'>Latest & Top </span> Job openings</h1>
    <div className='grid grid-cols-3  gap-4 my-5'>
{
        randomjobs.slice(0,6).map((item, index)=> <LatestJobCards />)
    }
    </div>
       </div>
  )
}

export default LatestJobs
