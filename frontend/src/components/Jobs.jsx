import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { getAllJobs } from "@/redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manually fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      await dispatch(getAllJobs());
      setLoading(false);
    };
    fetchJobs();
  }, [dispatch]);

  // Filter jobs when search query changes
  useEffect(() => {
    if (allJobs && allJobs.length > 0) {
      if (searchedQuery) {
        const filteredJobs = allJobs.filter((job) => {
          return (
            job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.stipend?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.duration?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job?.skillsRequired?.some(skill =>
              skill.toLowerCase().includes(searchedQuery.toLowerCase())
            )
          );
        });
        setFilterJobs(filteredJobs);
      } else {
        setFilterJobs(allJobs);
      }
    } else {
      setFilterJobs([]);
    }
  }, [allJobs, searchedQuery]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 shrink-0">
            <div className="sticky top-6">
              <FilterCard />
            </div>
          </div>

          {/* Jobs Section */}
          <div className="flex-1">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <p className="text-gray-400 text-lg font-medium">No internships found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Showing <span className="font-semibold text-gray-700">{filterJobs.length}</span> internships
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
                  {filterJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      key={job?._id}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;