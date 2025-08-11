import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { dashboardAPI, exploreAPI, integrationsAPI } from '../services/api';
// React Icons
import { FaPlane, FaUser, FaSearch, FaFilter, FaTh, FaSort, FaSuitcase, FaPlus } from 'react-icons/fa';

const MainLanding = () => {
  const headerRef = useRef(null);
  const bannerRef = useRef(null);
  const topRegionsRef = useRef([]);
  const tripsRef = useRef([]);
  const buttonRef = useRef(null);
  
  const [dashboardData, setDashboardData] = useState({
    upcomingTrips: [],
    popularCities: []
  });
  const [heroImage, setHeroImage] = useState(null);
  const [tripImages, setTripImages] = useState({});

  topRegionsRef.current = [];
  tripsRef.current = [];

  useEffect(() => {
    fetchDashboardData();
    fetchHeroImage();
    
    let ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { autoAlpha: 0, y: -60 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, scale: 0.9, y: 30 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 1.5, delay: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(
        topRegionsRef.current,
        { autoAlpha: 0, y: 40, scale: 0.8 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          delay: 0.6,
          duration: 1.2,
          ease: "back.out(1.7)",
        }
      );

      gsap.fromTo(
        tripsRef.current,
        { autoAlpha: 0, y: 50, rotationY: 15 },
        {
          autoAlpha: 1,
          y: 0,
          rotationY: 0,
          stagger: 0.2,
          delay: 0.9,
          duration: 1.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        buttonRef.current,
        { autoAlpha: 0, y: 20, scale: 0.8 },
        { autoAlpha: 1, y: 0, scale: 1, delay: 1.2, duration: 0.8, ease: "back.out(1.7)" }
      );
    });

    return () => ctx.revert();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const [dashResponse, citiesResponse] = await Promise.all([
        dashboardAPI.getData(),
        exploreAPI.getPopularCities({ limit: 4 })
      ]);
      
      const cities = citiesResponse.data.data.cities || [];
      
      const trips = dashResponse.data.data.upcomingTrips || [];
      
      setDashboardData({
        upcomingTrips: trips,
        popularCities: cities
      });

      // Fetch images for cities and trips
      if (cities.length > 0) {
        fetchCityImages(cities);
      }
      if (trips.length > 0) {
        fetchTripImages(trips);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchHeroImage = async () => {
    try {
      const res = await integrationsAPI.searchImages({ query: 'travel landscape', per_page: 1 });
      const url = res.data?.data?.results?.[0]?.urls?.regular;
      if (url) setHeroImage(url);
    } catch (e) {
      console.log('Unsplash API not configured, using default banner');
    }
  };

  const fetchCityImages = async (cities) => {
    try {
      const imagePromises = cities.map(async (city, index) => {
        try {
          const res = await integrationsAPI.searchImages({ 
            query: `${city.name} ${city.country} travel`, 
            per_page: 1 
          });
          return {
            ...city,
            imageUrl: res.data?.data?.results?.[0]?.urls?.regular || 
                     `https://placehold.co/300x300/6EE7B7/1F2937?text=${city.name || `City ${index+1}`}`
          };
        } catch (error) {
          return {
            ...city,
            imageUrl: `https://placehold.co/300x300/6EE7B7/1F2937?text=${city.name || `City ${index+1}`}`
          };
        }
      });
      
      const citiesWithImages = await Promise.all(imagePromises);
      setDashboardData(prev => ({
        ...prev,
        popularCities: citiesWithImages
      }));
    } catch (error) {
      console.log('Failed to fetch city images, using placeholders');
    }
  };

  const fetchTripImages = async (trips) => {
    try {
      const imagePromises = trips.map(async (trip, index) => {
        try {
          const res = await integrationsAPI.searchImages({ 
            query: `${trip.name} travel destination`, 
            per_page: 1 
          });
          return {
            tripId: trip.id || index,
            imageUrl: res.data?.data?.results?.[0]?.urls?.regular || 
                     `https://placehold.co/300x400/93C5FD/1E40AF?text=${trip.name || `Trip ${index+1}`}`
          };
        } catch (error) {
          return {
            tripId: trip.id || index,
            imageUrl: `https://placehold.co/300x400/93C5FD/1E40AF?text=${trip.name || `Trip ${index+1}`}`
          };
        }
      });
      
      const tripImagesData = await Promise.all(imagePromises);
      const imagesMap = {};
      tripImagesData.forEach(item => {
        imagesMap[item.tripId] = item.imageUrl;
      });
      setTripImages(imagesMap);
    } catch (error) {
      console.log('Failed to fetch trip images, using placeholders');
    }
  };

  const regions = dashboardData.popularCities.slice(0, 4);
  const trips = dashboardData.upcomingTrips.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header
        ref={headerRef}
        className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-md"
      >
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaPlane /> GlobalTrotter
        </h1>
        <Link to="/profile">
        <FaUser className="text-3xl text-blue-600" />
        </Link>
      </header>

      <section
        ref={bannerRef}
        className="w-full h-40 sm:h-60 md:h-72 rounded-lg m-4 sm:m-8 flex items-center justify-center shadow-inner overflow-hidden relative"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: heroImage ? undefined : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {!heroImage && (
          <div className="text-center text-white">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Explore the World</h1>
            <p className="text-lg sm:text-xl opacity-90">Plan your next adventure with GlobeTrotter</p>
          </div>
        )}
        {heroImage && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">Explore the World</h1>
              <p className="text-lg sm:text-xl opacity-90">Plan your next adventure with GlobeTrotter</p>
            </div>
          </div>
        )}
      </section>

      <div className="px-4 sm:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-1/2">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-lg pl-10 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FaTh className="text-sm" /> Group by
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FaFilter className="text-sm" /> Filter
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FaSort className="text-sm" /> Sort by
          </button>
        </div>
      </div>

    
      <section className="px-4 sm:px-8 py-4">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">
          Top Regional Selections
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regions.map((city, i) => (
            <div
              key={city.id || i}
              ref={(el) => (topRegionsRef.current[i] = el)}
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer aspect-square rounded-lg flex flex-col items-center justify-center text-blue-700 font-medium shadow-sm transition overflow-hidden relative"
            >
                             <img
                 src={city.imageUrl || `https://placehold.co/150x150/6EE7B7/1F2937?text=${city.name || `Region ${i+1}`}`}
                 alt={city.name || `Region ${i+1}`}
                 className="w-full h-full object-cover rounded-lg"
                 onError={(e) => {
                   e.target.src = `https://placehold.co/150x150/6EE7B7/1F2937?text=${city.name || `Region ${i+1}`}`;
                 }}
               />
              <span className="absolute bottom-1 left-1 text-white font-semibold bg-black bg-opacity-50 px-2 rounded">
                {city.name || `Region ${i+1}`}
              </span>
            </div>
          ))}
        </div>
      </section>

    
      <section className="px-4 sm:px-8 py-4 flex-1">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">Previous Trips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trips.map((trip, i) => (
            <div
              key={trip.id || i}
              ref={(el) => (tripsRef.current[i] = el)}
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg flex flex-col items-center justify-center text-blue-700 font-medium aspect-[3/4] shadow-sm transition overflow-hidden relative"
            >
                             <img
                 src={tripImages[trip.id || i] || `https://placehold.co/300x400/93C5FD/1E40AF?text=${trip.name || `Trip ${i+1}`}`}
                 alt={trip.name || `Trip ${i+1}`}
                 className="w-full h-full object-cover rounded-lg"
                 onError={(e) => {
                   e.target.src = `https://placehold.co/300x400/93C5FD/1E40AF?text=${trip.name || `Trip ${i+1}`}`;
                 }}
               />
              <div className="absolute bottom-2 left-2 text-white font-semibold bg-blue-900 bg-opacity-70 px-3 py-1 rounded flex items-center">
                <FaSuitcase className="mr-2" />
                {trip.name || `Trip ${i+1}`}
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <Link to="/new">
        <button
          ref={buttonRef}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-6 py-4 rounded-full shadow-xl flex items-center gap-3 z-50 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
        >
          <FaPlus className="text-lg" />
          Plan a Trip
        </button>
      </Link>
    </div>
  );
};

export default MainLanding;
