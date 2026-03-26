import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <span className="inline-block px-4 py-2 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-6">
          No. 1 Internship Portal for Students
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Find Your <span className="text-blue-600">Dream Internship</span> Today
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Search, apply and gain experience with trusted & top companies. Discover thousands of
          opportunities tailored for students and fresh graduates.
        </p>

        {/* Search Box */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          
          <div className="flex items-center w-full bg-white rounded-xl shadow-md px-4 py-3">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search internships, skills, companies..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>

          <Button onClick={searchJobHandler} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
            Search
          </Button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;