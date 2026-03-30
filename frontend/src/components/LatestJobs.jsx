import React, { useState } from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';


//const randomjobs = [1,2,3,4,5,6,7,8];
const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMoreHandler = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className='max-w-6xl mx-auto my-20 px-6'>

      <h1 className='text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6'>
        <span className='text-[#6A38C2]'>Latest & Top </span> Internship Opportunities
      </h1>

      <p className='text-center text-gray-500 text-lg mb-12'>
        Discover the most recent and prestigious internship opportunities tailored for students and fresh graduates.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {
          allJobs.length <= 0
            ? <span className='text-center text-gray-400 col-span-full'>No internships Available</span>
            : allJobs?.slice(0, visibleCount).map((job) => (
                <LatestJobCards key={job._id} job={job} />
              ))
        }
      </div>

      {allJobs.length > visibleCount && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreHandler}
            className="bg-[#6A38C2] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#5b30a6] hover:scale-105 transition-all duration-300"
          >
            Load More Internships ↓
          </button>
        </div>
      )}

    </div>
  );
};

export default LatestJobs
