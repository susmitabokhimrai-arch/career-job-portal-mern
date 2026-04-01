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
  };

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-24 overflow-hidden">

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        <span className="inline-block px-4 py-2 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-6 shadow-sm">
          🚀 No. 1 Internship Portal for Students
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Find Your <span className="text-blue-600">Dream Internship</span> Today
        </h1>

        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Discover thousands of opportunities, apply instantly, and kickstart your career with top companies.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">

          <div className="flex items-center w-full bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search internships, skills, companies..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>

          <Button
            onClick={searchJobHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Search
          </Button>
        </div>

        <div className="flex justify-center gap-10 mt-14 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
            <p className="text-gray-500 text-sm">Internships</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">5K+</h3>
            <p className="text-gray-500 text-sm">Companies</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">20K+</h3>
            <p className="text-gray-500 text-sm">Students</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;