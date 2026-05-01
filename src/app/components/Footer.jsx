'use client';

import React from 'react';
import Image from 'next/image';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

// Updated paths to use public/images folder
const actionCarLogo = '/images/actioncarlogo.png';
const awardHome = '/images/awardhome.png';

const Footer = () => {
  return (
    <footer className="relative w-full">
      {/* Wave curve top border */}
      <div className="w-full h-12 sm:h-14 md:h-16 bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#1393c4" d="M0,0 C240,100 480,100 720,50 C960,0 1200,0 1440,100 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
      
      {/* Footer content with sky blue and white theme */}
      <div className="w-full py-6 sm:py-8 md:py-10 text-white" style={{backgroundColor: '#1393c4'}}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* Contact Information */}
            <div className="mb-6 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4 border-b-2 border-white pb-2">Contact Information</h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">Action Car Detailing</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">1380 Sargent avenue,</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">Winnipeg, MB, R3E 0G5</p>
            </div>
            
            {/* Phone & Email */}
            <div className="mb-6 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4 border-b-2 border-white pb-2">Get In Touch</h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base"><span className="font-bold">Phone:</span> (204) 775-0005</p>
              <p className="mb-2 sm:mb-4 text-sm sm:text-base"><span className="font-bold">Email:</span> info@actioncardetailing.ca</p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                <a 
                  href="https://www.facebook.com/actioncardetailingwinnipeg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook size={16} className="sm:text-lg md:text-xl" />
                </a>
                <a 
                  href="https://www.instagram.com/actioncardetailingwinnipeg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-pink-600 flex items-center justify-center hover:bg-pink-50 hover:text-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram size={16} className="sm:text-lg md:text-xl" />
                </a>
              </div>
              
              {/* Follow us text */}
              <p className="text-xs sm:text-sm mt-2 opacity-90">Follow us for updates and showcases!</p>
            </div>
            
            {/* Business Hours */}
            <div className="mb-6 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4 border-b-2 border-white pb-2">Business Hours</h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">Monday – Friday | 8 AM – 6 PM</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">Saturday | 8AM – 3 PM</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">Sunday | Closed</p>
            </div>
            
            {/* Logo and Award section */}
            <div className="flex flex-col items-center justify-center mt-2 sm:mt-0 space-y-4">
              {/* Logo */}
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="relative w-36 sm:w-40 md:w-48 h-auto">
                  <Image 
                    src={actionCarLogo} 
                    alt="Action Car Detailing" 
                    width={192}
                    height={192}
                    className="w-full h-auto"
                    priority={false}
                  />
                </div>
              </div>
              
              {/* Award Badge */}
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <div className="relative w-20 sm:w-24 md:w-28 h-auto">
                  <Image 
                    src={awardHome} 
                    alt="Award Recognition" 
                    width={112}
                    height={112}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 border-t-2 border-white border-opacity-30 text-center">
            <p className="text-sm sm:text-base">© {new Date().getFullYear()} Action Car Detailing. All Rights Reserved.</p>
            <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">Website Design by Building india Digital</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;