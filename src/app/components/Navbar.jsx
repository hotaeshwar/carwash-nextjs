'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

// ✅ CHANGED: No imports - images served from /public folder
const actionCarLogo = '/images/actioncarlogo.png';
const awardLogo = '/images/awardhome.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesDropdownOpen, setMobileServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ CHANGED: useNavigate → useRouter, useLocation → usePathname
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  // ✅ CHANGED: location.pathname → pathname
  const isServiceActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  // ✅ CHANGED: Helper to check active link (replaces NavLink isActive)
  const isLinkActive = (to, exact = false) => {
    if (exact) return pathname === to;
    return pathname === to;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', to: '/', exact: true, internal: true },
    { name: 'ABOUT', to: '/about-us', internal: true },
    { name: 'GIFT CARD', to: '/giftcard', internal: true },
    { name: 'SERVICES', hasDropdown: true },
    { name: 'BEFORE & AFTER', to: '/before-after', internal: true },
    { name: 'TESTIMONIALS', to: '/testimonials', internal: true },
    { name: 'REFERENCES', to: '/references', internal: true },
  ];

  const serviceItems = [
    { name: 'OUR SERVICES', to: '/services', internal: true },
    { name: 'AUTO DETAILING', to: '/auto-detailing', internal: true },
    { name: 'PAINT CORRECTION POLISHING', to: '/paint-correction-polishing', internal: true },
    { name: 'WINDOW TINTING', to: '/window-tinting', internal: true },
    { name: 'CERAMIC COATING', to: '/ceramic-coating', internal: true },
    { name: 'PAINT PROTECTION FILM', to: '/paint-protection-film', internal: true },
    { name: 'REMEDIATION CLAIMS', to: '/remediation-claim', internal: true },
  ];

  return (
    <>
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="transition-all duration-300">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-between h-28 sm:h-32 md:h-36 lg:h-28 xl:h-32 relative px-2 sm:px-3 md:px-4">

              {/* Logo - Left side */}
              {/* ✅ CHANGED: Link replaces div for SEO */}
              <Link href="/" className="flex-shrink-0 transform transition-transform hover:scale-105 cursor-pointer z-10 lg:w-80 lg:flex lg:justify-start lg:-ml-4 min-w-0 flex items-center mr-6 lg:mr-10 xl:mr-14">
                <Image
                  className="h-16 sm:h-20 md:h-24 lg:h-20 xl:h-24 w-auto filter drop-shadow-lg max-w-[140px] xs:max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[280px] object-contain"
                  src={actionCarLogo}
                  alt="Action Car Detailing Logo"
                  width={280}
                  height={96}
                  priority={true}
                />
                <Image
                  className="h-20 sm:hidden w-auto ml-2 opacity-90 object-contain"
                  src={awardLogo}
                  alt="Consumer Choice Award 2026 - 3 Year Winner"
                  width={80}
                  height={80}
                  priority={true}
                />
              </Link>

              {/* Desktop Navigation - Centered */}
              <div className="hidden lg:flex items-center justify-center space-x-0.5 xl:space-x-1 flex-1 min-w-0 z-50">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative" ref={link.name === 'SERVICES' ? dropdownRef : null}>
                    {link.hasDropdown ? (
                      <button
                        onClick={toggleServicesDropdown}
                        className={`mafia-nav-link flex items-center text-xs ${
                          serviceItems.some(item => isServiceActive(item.to)) ? 'active-nav' : ''
                        }`}
                      >
                        <span>{link.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 inline ml-1 transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : link.internal ? (
                      // ✅ CHANGED: NavLink → Next.js Link
                      <Link
                        href={link.to}
                        className={`mafia-nav-link text-xs ${isLinkActive(link.to, link.exact) ? 'active-nav' : ''}`}
                      >
                        <span>{link.name}</span>
                      </Link>
                    ) : (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mafia-nav-link text-xs"
                      >
                        <span>{link.name}</span>
                      </a>
                    )}

                    {/* Desktop Service Dropdown */}
                    {link.name === 'SERVICES' && servicesDropdownOpen && (
                      <div className="vivid-ozone-dropdown absolute mt-2 w-56 lg:w-60 xl:w-64 rounded-md shadow-2xl overflow-hidden z-20">
                        <div className="py-1">
                          {serviceItems.map((service) => (
                            // ✅ CHANGED: NavLink → Next.js Link
                            <Link
                              key={service.name}
                              href={service.to}
                              onClick={() => {
                                setServicesDropdownOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className={`service-menu-item w-full text-left block px-4 py-3 text-sm text-white transition-all duration-200 border-l-4 border-transparent ${
                                isServiceActive(service.to) ? 'active-service-item' : ''
                              }`}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Award Logo */}
              <div className="flex-shrink-0 transform transition-transform hover:scale-105 cursor-pointer z-20 lg:w-44 xl:w-48 lg:flex lg:justify-end lg:items-center min-w-0 hidden sm:flex ml-4 lg:ml-6 xl:ml-8">
                <a
                  href="https://www.ccaward.com/award-winners/winnipeg-greater-region/best-automobile-detailing/action-car-detailing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    className="h-24 lg:h-28 xl:h-32 w-auto filter drop-shadow-lg max-w-[120px] lg:max-w-[140px] xl:max-w-[160px] object-contain -mt-2"
                    src={awardLogo}
                    alt="Consumer Choice Award 2026 - 3 Year Winner Winnipeg"
                  />
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center z-50 ml-auto">
                <button
                  onClick={toggleMenu}
                  className="relative inline-flex items-center justify-center p-2 focus:outline-none"
                  style={{ color: '#1393c4' }}
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className="absolute w-6 h-1 transition-all duration-300 ease-in-out transform"
                         style={{
                           backgroundColor: '#1393c4',
                           fontWeight: 'bold',
                           height: '3px',
                           top: isMenuOpen ? '50%' : '30%',
                           transform: isMenuOpen ? 'translateY(-50%) rotate(45deg)' : 'translateY(-50%)',
                           opacity: isMenuOpen ? 1 : 1
                         }}></div>
                    <div className="absolute w-6 h-1 transition-all duration-300 ease-in-out"
                         style={{
                           backgroundColor: '#1393c4',
                           fontWeight: 'bold',
                           height: '3px',
                           top: '50%',
                           transform: 'translateY(-50%)',
                           opacity: isMenuOpen ? 0 : 1
                         }}></div>
                    <div className="absolute w-6 h-1 transition-all duration-300 ease-in-out transform"
                         style={{
                           backgroundColor: '#1393c4',
                           fontWeight: 'bold',
                           height: '3px',
                           top: isMenuOpen ? '50%' : '70%',
                           transform: isMenuOpen ? 'translateY(-50%) rotate(-45deg)' : 'translateY(-50%)',
                           opacity: isMenuOpen ? 1 : 1
                         }}></div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 shadow-2xl z-40 mt-32 overflow-y-auto backdrop-blur-sm" style={{ backgroundColor: '#1393c4' }}>
            <div className="px-2 sm:px-3 md:px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setMobileServicesDropdownOpen(!mobileServicesDropdownOpen)}
                        className="mobile-nav-link w-full flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base md:text-lg font-medium text-white transition-all duration-200"
                        style={{
                          background: mobileServicesDropdownOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                      >
                        {link.name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform duration-300 ${mobileServicesDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: 'white' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileServicesDropdownOpen && (
                        <div className="pl-4 sm:pl-6 md:pl-8 space-y-1">
                          {serviceItems.map((service) => (
                            // ✅ CHANGED: NavLink → Next.js Link
                            <Link
                              key={service.name}
                              href={service.to}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setMobileServicesDropdownOpen(false);
                              }}
                              className={`mobile-service-item w-full text-left block px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm md:text-base font-medium text-gray-200 transition-all duration-200 border-l-2 ${
                                isServiceActive(service.to) ? 'active-mobile-service' : ''
                              }`}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : link.internal ? (
                    // ✅ CHANGED: NavLink → Next.js Link
                    <Link
                      href={link.to}
                      className={`mobile-nav-item w-full text-left block px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base md:text-lg font-medium text-white transition-all duration-200 ${
                        isLinkActive(link.to, link.exact) ? 'active-mobile-nav' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-nav-item w-full text-left block px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base md:text-lg font-medium text-white transition-all duration-200 hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ CHANGED: style jsx → style (removed jsx keyword) */}
        <style>{`
          :root {
            --vivid-ozone: #00BFFF;
            --vivid-ozone-secondary: #1E90FF;
            --vivid-ozone-accent: #00D4FF;
            --vivid-ozone-glow: rgba(0, 191, 255, 0.4);
            --vivid-ozone-shadow: rgba(0, 191, 255, 0.6);
            --vivid-azure: #1393c4;
          }

          .vivid-ozone-dropdown {
            background: var(--vivid-ozone);
            border: 2px solid var(--vivid-ozone-accent);
            box-shadow: 
              0 10px 25px var(--vivid-ozone-shadow),
              0 5px 15px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            max-height: 500px;
            overflow-y: auto;
          }

          .vivid-ozone-dropdown::-webkit-scrollbar { width: 6px; }
          .vivid-ozone-dropdown::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 3px; }
          .vivid-ozone-dropdown::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }

          .border-vivid-ozone {
            border-color: var(--vivid-ozone) !important;
            box-shadow: 0 0 10px var(--vivid-ozone-glow);
          }

          .mafia-nav-link {
            position: relative;
            display: inline-block;
            padding: 0.3rem 0.5rem;
            font-size: 0.65rem;
            font-weight: 500;
            text-transform: uppercase;
            color: white;
            background: var(--vivid-ozone);
            clip-path: polygon(10% 0, 100% 0%, 90% 100%, 0% 100%);
            margin: 0 0.1rem;
            transition: all 0.3s ease;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 0 15px var(--vivid-ozone-glow);
            border: none;
            cursor: pointer;
            white-space: nowrap;
            text-decoration: none;
            text-align: center;
          }

          .mafia-nav-link.active-nav {
            background: var(--vivid-ozone-secondary);
            box-shadow: 
              0 6px 10px -2px rgba(0, 0, 0, 0.15), 
              0 4px 6px -1px rgba(0, 0, 0, 0.08),
              0 0 25px var(--vivid-ozone-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
          }

          @media (min-width: 1024px) {
            .mafia-nav-link { padding: 0.35rem 0.6rem; font-size: 0.7rem; margin: 0 0.15rem; }
          }
          @media (min-width: 1280px) {
            .mafia-nav-link { padding: 0.4rem 0.75rem; font-size: 0.75rem; margin: 0 0.2rem; }
          }
          @media (min-width: 1536px) {
            .mafia-nav-link { padding: 0.45rem 0.85rem; font-size: 0.8rem; margin: 0 0.25rem; }
          }
          @media (min-width: 1024px) and (max-width: 1366px) {
            .mafia-nav-link {
              padding: 0.35rem 0.5rem !important;
              font-size: 0.65rem !important;
              margin: 0 0.08rem !important;
              min-width: auto !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
          }
          @media (max-width: 475px) {
            .flex.items-center.justify-between { gap: 0.5rem; }
          }

          .mafia-nav-link:hover {
            background: var(--vivid-ozone-accent);
            transform: translateY(-3px);
            box-shadow: 
              0 12px 20px -5px rgba(0, 0, 0, 0.15), 
              0 6px 10px -3px rgba(0, 0, 0, 0.08),
              0 0 30px var(--vivid-ozone-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }

          .service-menu-item {
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(5px);
            border-left: 4px solid transparent;
            cursor: pointer;
            text-decoration: none !important;
            display: block;
          }
          .service-menu-item:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            border-left-color: white !important;
            box-shadow: inset 4px 0 0 white, 0 0 15px var(--vivid-ozone-glow);
            text-decoration: none !important;
          }
          .service-menu-item.active-service-item {
            background: rgba(255, 255, 255, 0.3) !important;
            border-left-color: var(--vivid-ozone-accent) !important;
            color: white !important;
            box-shadow: inset 4px 0 0 var(--vivid-ozone-accent), 0 0 20px var(--vivid-ozone-glow);
            text-decoration: none !important;
          }

          .mobile-nav-link:hover { color: white !important; background: rgba(255, 255, 255, 0.1) !important; }
          .mobile-nav-item:hover { color: white !important; background: rgba(255, 255, 255, 0.1) !important; border-left: 4px solid white !important; }
          .mobile-nav-item.active-mobile-nav {
            background: rgba(255, 255, 255, 0.2) !important;
            border-left: 4px solid white !important;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          }

          .mobile-service-item { background: transparent; cursor: pointer; text-decoration: none !important; display: block; }
          .mobile-service-item:hover { color: white !important; background: rgba(255, 255, 255, 0.1) !important; border-left-color: white !important; }
          .mobile-service-item.active-mobile-service {
            background: rgba(255, 255, 255, 0.2) !important;
            border-left-color: white !important;
            color: white !important;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </nav>
    </>
  );
};

export default Navbar;