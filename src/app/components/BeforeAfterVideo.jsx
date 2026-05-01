import React from 'react';
import path from 'path';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

const BeforeAfterVideo = () => {
  const beforeAfterVideo = '/images/BEFOREANDAFTER.mp4';
  const beforeVideo = '/images/beforenew.mp4';
  const afterVideo = '/images/afternew.mp4';

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 pt-20 md:pt-24 lg:pt-28 pb-10">
        {/* Header Text */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold block mb-2" style={{ color: '#1393c4' }}>
            Before & After
          </span>
          <span className="text-lg md:text-xl lg:text-2xl font-semibold underline decoration-2 underline-offset-2" style={{ color: '#1393c4' }}>
            Here is Our Works
          </span>
        </div>
        {/* All Video Cards */}
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Original Before & After Video */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold mb-3" style={{ color: '#1393c4' }}>Before & After</span>
            <div className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl lg:shadow-2xl">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
              >
                <source src={beforeAfterVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          {/* Before & After Split Video Card */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold mb-3" style={{ color: '#1393c4' }}>Before & After</span>
            <div className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl lg:shadow-2xl flex">
              {/* Before half */}
              <div className="relative w-1/2 h-full">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={beforeVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <span className="absolute bottom-2 left-2 bg-[#1393c4] text-white text-xs font-bold px-2 py-0.5 rounded">
                  BEFORE
                </span>
              </div>
              {/* After half */}
              <div className="relative w-1/2 h-full">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={afterVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <span className="absolute bottom-2 right-2 bg-[#1393c4] text-white text-xs font-bold px-2 py-0.5 rounded">
                  AFTER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Section */}
      <ContactForm />
      <Footer />
    </div>
  );
};

export default BeforeAfterVideo;