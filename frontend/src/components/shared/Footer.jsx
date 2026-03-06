import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Career<span className="text-blue-500">Yatra</span>
          </h2>
          <p className="text-sm text-gray-400 leading-6">
            Find your dream job easily. Connect with top companies and
            recruiters worldwide and build your future with confidence.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-500 transition" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-sky-400 transition" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-600 transition" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition">Home</li>
            <li className="hover:text-white cursor-pointer transition">Browse Jobs</li>
            <li className="hover:text-white cursor-pointer transition">Companies</li>
            <li className="hover:text-white cursor-pointer transition">Contact Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition">Career Advice</li>
            <li className="hover:text-white cursor-pointer transition">Resume Tips</li>
            <li className="hover:text-white cursor-pointer transition">Interview Guide</li>
            <li className="hover:text-white cursor-pointer transition">Help Center</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm text-gray-400">support@careeryatra.com</p>
          <p className="text-sm text-gray-400 mt-2">+977 98765 43210</p>
          <p className="text-sm text-gray-400 mt-2">Nepal</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2026 CareerYatra. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;