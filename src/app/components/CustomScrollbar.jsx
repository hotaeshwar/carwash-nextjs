'use client';

// components/CustomScrollbar.jsx
import { useEffect, useState } from 'react';

const CustomScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <div className="relative">
        <svg width="80" height="80" className="transform -rotate-90 drop-shadow-lg">
          {/* Background circle - Darker for contrast */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#374151"
            strokeWidth="4"
            fill="white"
            className="opacity-90"
          />
          {/* Progress circle - Custom blue color */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#1393c4"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(19, 147, 196, 0.6))'
            }}
          />
        </svg>
        
        {/* Percentage text - Dark for contrast */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800 transition-colors duration-200" style={{ color: '#1393c4' }}>
            {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap pointer-events-none">
          Scroll Progress
        </div>
      </div>
    </div>
  );
};

export default CustomScrollbar;