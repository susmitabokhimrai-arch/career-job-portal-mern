import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { MapPin, Briefcase, Wallet, Clock, X, BriefcaseIcon  } from "lucide-react";
import { Button } from "./ui/button";

const colorMap = {
  Location: {
    active: "bg-blue-600 text-white border-blue-600",
    hover: "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700",
    dot: "bg-blue-500",
    icon: "text-blue-500",
  },
  Industry: {
    active: "bg-[#7209b7] text-white border-[#7209b7]",
    hover: "hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700",
    dot: "bg-[#7209b7]",
    icon: "text-[#7209b7]",
  },
  Stipend: {
    active: "bg-green-600 text-white border-green-600",
    hover: "hover:bg-green-50 hover:border-green-300 hover:text-green-700",
    dot: "bg-green-500",
    icon: "text-green-500",
  },
  Duration: {
    active: "bg-orange-500 text-white border-orange-500",
    hover: "hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600",
    dot: "bg-orange-400",
    icon: "text-orange-400",
  },
  JobType: {
    active: "bg-pink-600 text-white border-pink-600",
    hover: "hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700",
    dot: "bg-pink-500",
    icon: "text-pink-500",
  },
};

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    industry: [],
    stipend: [],
    duration: [],
    jobType: []
  });
  const dispatch = useDispatch();
  const { allJobs } = useSelector(store => store.job);

  // DYNAMIC FILTER OPTIONS - extracted from actual job data
  const [dynamicFilterData, setDynamicFilterData] = useState([
    { filterType: "Location", icon: <MapPin size={14} />, array: [] },
    { filterType: "Industry", icon: <Briefcase size={14} />, array: [] },
    { filterType: "Stipend", icon: <Wallet size={14} />, array: [] },
    { filterType: "Duration", icon: <Clock size={14} />, array: [] },
    { filterType: "JobType", icon: <BriefcaseIcon size={14} />, array: [] }, 
  ]);
  // Function to extract unique values from jobs for each filter category
  const extractUniqueFilterOptions = () => {
    if (!allJobs || allJobs.length === 0) return;

    // Get unique locations - filter out empty/null/undefined values
    const uniqueLocations = [...new Set(
      allJobs
        .map(job => job?.location)
        .filter(location => location && location.trim() !== "")
    )];
    
    // Get unique industries (based on job title) - filter out empty values
    const uniqueIndustries = [...new Set(
      allJobs
        .map(job => job?.title)
        .filter(title => title && title.trim() !== "")
    )];
    
    // Get unique stipend values - filter out empty values
    const uniqueStipends = [...new Set(
      allJobs
        .map(job => job?.stipend)
        .filter(stipend => stipend && stipend.trim() !== "")
    )];
    // Get unique job type values 
    const uniqueJobTypes = [...new Set(
      allJobs
        .map(job => job?.internshipType || job?.jobType || job?.employmentType || job?.type)
        .filter(jobType => jobType && jobType.trim() !== "")
    )];

    
    // Get unique duration values - filter out empty values
    const uniqueDurations = [...new Set(
      allJobs
        .map(job => job?.duration)
        .filter(duration => duration && duration.trim() !== "")
    )];

    // ========== ADDED CONSOLE LOGS FOR DEBUGGING ==========
    console.log("📊 Filter Options Extracted:");
    console.log("  Locations:", uniqueLocations);
    console.log("  Industries:", uniqueIndustries);
    console.log("  Stipends:", uniqueStipends);
    console.log("  Durations:", uniqueDurations);
    console.log("  Job Types:", uniqueJobTypes);

    // Update dynamic filter data
    setDynamicFilterData([
      { filterType: "Location", icon: <MapPin size={14} />, array: uniqueLocations },
      { filterType: "Industry", icon: <Briefcase size={14} />, array: uniqueIndustries },
      { filterType: "Stipend", icon: <Wallet size={14} />, array: uniqueStipends },
      { filterType: "Duration", icon: <Clock size={14} />, array: uniqueDurations },
      { filterType: "JobType", icon: <BriefcaseIcon size={14} />, array: uniqueJobTypes },
    ]);
  };

  // Extract filter options whenever jobs change
  useEffect(() => {
    extractUniqueFilterOptions();
  }, [allJobs]);
  // Handle single filter selection (original behavior - for search query)
  const handleSelect = (filterType, value) => {
    console.log(`🔍 Filter clicked: ${filterType} = "${value}"`);
    const newValue = selectedValue === value ? "" : value;
    setSelectedValue(newValue);
    dispatch(setSearchedQuery(newValue));
    console.log(`📝 Search query set to: "${newValue}"`);
  };

  const handleClear = () => {
    console.log("🗑️ Clearing all filters");
    setSelectedValue("");
    setSelectedFilters({
      location: [],
      industry: [],
      stipend: [],
      duration: [],
      jobType: []
    });
    dispatch(setSearchedQuery(""));
  };

  // Count active filters for badge display
  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length + (selectedValue ? 1 : 0);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
        <div>
          <h1 className="text-sm font-bold text-gray-900">Filter Internships</h1>
          <p className="text-xs text-gray-400 mt-0.5">Narrow down your search</p>
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mx-4 mt-3 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-purple-400">Active:</span>
            {/* For single select mode */}
            {selectedValue && (
              <span className="text-xs font-semibold text-[#7209b7] bg-white px-2 py-0.5 rounded-full">
                {selectedValue}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter Options - DYNAMICALLY GENERATED FROM JOB DATA */}
      <div className="px-4 pt-4 pb-2 space-y-5">
        {dynamicFilterData.map((data, index) => {
          const colors = colorMap[data.filterType];

          // Skip rendering filter section if no options exist for this category
          if (data.array.length === 0) return null;
          
          return (
            <div key={index}>
              {/* Filter Header */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`${colors.icon}`}>{data.icon}</span>
                <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {data.filterType}
                </h2>
                {/* Show count of available options */}
                <span className="text-xs text-gray-400 ml-1">({data.array.length})</span>
              </div>

              {/* Filter Options as Buttons */}
              <div className="flex flex-wrap gap-2">
                {data.array.map((item, idx) => {
                  // For single select mode (current behavior)
                  const isActive = selectedValue === item;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(data.filterType, item)}
                      className={`
                        text-xs px-3 py-1.5 rounded-full border font-medium
                        transition-all duration-200 cursor-pointer
                        ${isActive ? colors.active : `bg-gray-50 text-gray-500 border-gray-200 ${colors.hover}`}
                      `}
                    >
                      {isActive && "✓ "}{item}
                    </button>
                  );
                })}
              </div>

              {/* Divider between filter sections */}
              {index < dynamicFilterData.length - 1 && (
                <hr className="mt-4 border-gray-100" />
              )}
            </div>
          );
        })}

        {/* Show message when no filter options available */}
        {dynamicFilterData.every(data => data.array.length === 0) && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No internships available</p>
            <p className="text-xs text-gray-300 mt-1">Add some jobs to see filters</p>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="px-4 py-4">
        <Button
          onClick={handleClear}
          variant="outline"
          className="w-full text-xs text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors duration-200 rounded-xl"
        >
          Reset All Filters
        </Button>
      </div>

    </div>
  );
};

export default FilterCard;