import React, { useState } from "react";
import { Facebook, Instagram, Twitter, Linkedin, Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RecruiterModal from "./RecruiterModal";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleProtectedRoute = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {showModal && <RecruiterModal onClose={() => setShowModal(false)} />}

      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">

        <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-blue-700/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Want to post an internship?</p>
              <p className="text-blue-300 text-xs mt-0.5">
                Contact our admin with your company details — we'll get you set up.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Contact Admin →
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Career<span className="text-blue-500">Yatra</span>
            </h2>
            <p className="text-sm text-gray-400 leading-6">
              Find your dream job easily. Connect with top companies and
              recruiters worldwide and build your future with confidence.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-500 transition" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <Twitter className="w-5 h-5 cursor-pointer hover:text-sky-400 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-600 transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li
                onClick={() => navigate("/")}
                className="hover:text-white cursor-pointer transition"
              >
                Home
              </li>
              <li
                onClick={() => navigate("/jobs")}
                className="hover:text-white cursor-pointer transition"
              >
                Browse Jobs
              </li>
              <li
                onClick={() => navigate("/browse")}
                className="hover:text-white cursor-pointer transition"
              >
                Browse Companies
              </li>
              <li
                onClick={() => handleProtectedRoute("/saved-jobs")}
                className="hover:text-white cursor-pointer transition"
              >
                Saved Jobs
              </li>
              <li
                onClick={() => handleProtectedRoute("/profile")}
                className="hover:text-white cursor-pointer transition"
              >
                My Profile
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              
              <li
                onClick={() => navigate("/forgot-password")}
                className="hover:text-white cursor-pointer transition"
              >
                Forgot Password
              </li>
              <li
                onClick={() => setShowModal(true)}
                className="hover:text-white cursor-pointer transition"
              >
                Post an Internship
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div
                onClick={() => window.location.href = "mailto:careeryatra2026@gmail.com"}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                careeryatra2026@gmail.com
              </div>
              <div
                onClick={() => window.location.href = "tel:+97798765432100"}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition cursor-pointer"
              >
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                +977 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                Kathmandu, Nepal
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© 2026 CareerYatra. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-gray-300 cursor-pointer transition">
                Privacy Policy
              </span>
              <span className="hover:text-gray-300 cursor-pointer transition">
                Terms of Use
              </span>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;