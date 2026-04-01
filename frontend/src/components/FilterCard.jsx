import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { MapPin, Briefcase, Wallet, Clock, X } from "lucide-react";
import { Button } from "./ui/button";

const filterData = [
  {
    filterType: "Location",
    icon: <MapPin size={14} />,
    array: ["Remote", "Kathmandu", "Pokhara", "Lalitpur"],
  },
  {
    filterType: "Industry",
    icon: <Briefcase size={14} />,
    array: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Science"],
  },
  {
    filterType: "Stipend",
    icon: <Wallet size={14} />,
    array: ["0-5k", "5k-10k", "10k-20k", "Unpaid"],
  },
  {
    filterType: "Duration",
    icon: <Clock size={14} />,
    array: ["< 1 month", "1-3 months", "3-6 months", "6+ months"],
  },
];

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
};

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const handleSelect = (value) => {
    const newValue = selectedValue === value ? "" : value;
    setSelectedValue(newValue);
    dispatch(setSearchedQuery(newValue));
  };

  const handleClear = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery(""));
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
        <div>
          <h1 className="text-sm font-bold text-gray-900">Filter Internships</h1>
          <p className="text-xs text-gray-400 mt-0.5">Narrow down your search</p>
        </div>
        {selectedValue && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      
      {selectedValue && (
        <div className="mx-4 mt-3 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">Active:</span>
            <span className="text-xs font-semibold text-[#7209b7]">{selectedValue}</span>
          </div>
          <button onClick={handleClear}>
            <X size={12} className="text-purple-300 hover:text-purple-600" />
          </button>
        </div>
      )}

      
      <div className="px-4 pt-4 pb-2 space-y-5">
        {filterData.map((data, index) => {
          const colors = colorMap[data.filterType];
          return (
            <div key={index}>
              
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`${colors.icon}`}>{data.icon}</span>
                <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {data.filterType}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.array.map((item, idx) => {
                  const isActive = selectedValue === item;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item)}
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

              {index < filterData.length - 1 && (
                <hr className="mt-4 border-gray-100" />
              )}
            </div>
          );
        })}
      </div>

      
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