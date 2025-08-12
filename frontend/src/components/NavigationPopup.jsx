import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaBolt, FaMapMarkerAlt, FaSuitcase, FaStar, FaTimes, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const NavigationPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const itemsRef = useRef([]);

  const menuItems = [
    {
      icon: FaBolt,
      title: 'Quick Start',
      description: 'Plan your trip instantly',
      link: '/quick-start',
      gradient: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Popular Destinations',
      description: 'Explore trending places',
      link: '/destinations',
      gradient: 'from-yellow-500 to-yellow-700'
    },
    {
      icon: FaSuitcase,
      title: 'My Trips',
      description: 'View your adventures',
      link: '/userTrip',
      gradient: 'from-yellow-600 to-yellow-800'
    },
    {
      icon: FaStar,
      title: 'Recommendations',
      description: 'Personalized suggestions',
      link: '/recommendations',
      gradient: 'from-yellow-400 to-yellow-700'
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Connect with travelers',
      link: '/Community',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(popupRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      
      gsap.fromTo(itemsRef.current,
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1, 
          delay: 0.2,
          ease: 'power2.out' 
        }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(popupRef.current, {
      x: '100%',
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[9998]"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] border-l-4 border-yellow-400"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 text-black">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quick Menu</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="text-black/80 mt-2">Choose your next adventure</p>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              ref={el => itemsRef.current[index] = el}
              onClick={handleClose}
              className="block group"
            >
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white group-hover:scale-110 transition-transform`}>
                    <item.icon className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => {
              // Add logout logic here
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50">
          <p className="text-center text-gray-500 text-sm">
            ✨ Discover amazing destinations
          </p>
        </div>
      </div>
    </>
  );
};

export default NavigationPopup;