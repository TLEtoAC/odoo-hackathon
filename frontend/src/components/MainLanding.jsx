import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI, exploreAPI, integrationsAPI, tripsAPI } from "../services/api";
import RoutePlanner from "./RoutePlanner";
import { FaPlane, FaUser, FaSearch, FaFilter, FaTh, FaSort, FaSuitcase, FaPlus, FaRoute, FaSignOutAlt, FaCog } from "react-icons/fa";

const MainLanding = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const headerRef = useRef(null);
  const bannerRef = useRef(null);
  const topRegionsRef = useRef([]);
  const tripsRef = useRef([]);
  const buttonRef = useRef(null);

  const [dashboardData, setDashboardData] = useState({
    upcomingTrips: [],
    previousTrips: [],
    popularCities: [],
  });
  const [heroImage, setHeroImage] = useState(null);
  const [tripImages, setTripImages] = useState({});
  const [loading, setLoading] = useState(true);

  topRegionsRef.current = [];
  tripsRef.current = [];

  useEffect(() => {
    fetchDashboardData();
    fetchHeroImage();

    // Refresh data when user returns to the page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

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

    return () => {
      ctx.revert();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Refresh data when component mounts (e.g., when navigating back)
  useEffect(() => {
    const handleFocus = () => {
      // Clear cache and force refresh when window gains focus
      localStorage.removeItem('dashboardData');
      fetchDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Clear cache when component mounts to ensure fresh data
  useEffect(() => {
    localStorage.removeItem('dashboardData');
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to load from localStorage first
      const cachedData = localStorage.getItem('dashboardData');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < 300000) { // 5 minutes cache
          setDashboardData(parsed.data);
          setLoading(false);
          return;
        }
      }
      
      // Fetch trips and cities separately
      const [tripsResponse, citiesResponse] = await Promise.all([
        tripsAPI.getUserTrips({ limit: 10 }),
        exploreAPI.getPopularCities({ limit: 4 }),
      ]);

      console.log('Trips response:', tripsResponse.data);
      console.log('Cities response:', citiesResponse.data);
      
      const cities = citiesResponse.data.data?.cities || [];
      const allTrips = tripsResponse.data.data?.trips || tripsResponse.data.trips || [];
      
      console.log('All trips found:', allTrips);
      
      const today = new Date();
      const upcomingTrips = allTrips.filter(trip => new Date(trip.start_date || trip.startDate) >= today);
      const previousTrips = allTrips.filter(trip => new Date(trip.end_date || trip.endDate) < today);
      
      console.log('Upcoming trips:', upcomingTrips);
      console.log('Previous trips:', previousTrips);

      const dashData = {
        upcomingTrips,
        previousTrips,
        popularCities: cities,
      };
      
      setDashboardData(dashData);
      
      // Cache data in localStorage
      localStorage.setItem('dashboardData', JSON.stringify({
        data: dashData,
        timestamp: Date.now()
      }));

      if (cities.length > 0) {
        fetchCityImages(cities);
      }
      if ([...upcomingTrips, ...previousTrips].length > 0) {
        fetchTripImages([...upcomingTrips, ...previousTrips]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Try to load from cache even if expired
      const cachedData = localStorage.getItem('dashboardData');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setDashboardData(parsed.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroImage = async () => {
    try {
      const res = await integrationsAPI.searchImages({
        query: "travel landscape",
        per_page: 1,
      });
      const url = res.data?.data?.results?.[0]?.urls?.regular;
      if (url) setHeroImage(url);
    } catch (e) {
      console.log("Unsplash API not configured, using default banner");
    }
  };

  const fetchCityImages = async (cities) => {
    try {
      const imagePromises = cities.map(async (city, index) => {
        try {
          const res = await integrationsAPI.searchImages({
            query: `${city.name} ${city.country} travel`,
            per_page: 1,
          });
          return {
            ...city,
            imageUrl:
              res.data?.data?.results?.[0]?.urls?.regular ||
              `https://placehold.co/300x300/6EE7B7/1F2937?text=${
                city.name || `City ${index + 1}`
              }`,
          };
        } catch (error) {
          return {
            ...city,
            imageUrl: `https://placehold.co/300x300/6EE7B7/1F2937?text=${
              city.name || `City ${index + 1}`
            }`,
          };
        }
      });

      const citiesWithImages = await Promise.all(imagePromises);
      setDashboardData((prev) => ({
        ...prev,
        popularCities: citiesWithImages,
      }));
    } catch (error) {
      console.log("Failed to fetch city images, using placeholders");
    }
  };

  const fetchTripImages = async (trips) => {
    try {
      const imagePromises = trips.map(async (trip, index) => {
        try {
          const res = await integrationsAPI.searchImages({
            query: `${trip.name} travel destination`,
            per_page: 1,
          });
          return {
            tripId: trip.id || index,
            imageUrl:
              res.data?.data?.results?.[0]?.urls?.regular ||
              `https://placehold.co/300x400/93C5FD/1E40AF?text=${
                trip.name || `Trip ${index + 1}`
              }`,
          };
        } catch (error) {
          return {
            tripId: trip.id || index,
            imageUrl: `https://placehold.co/300x400/93C5FD/1E40AF?text=${
              trip.name || `Trip ${index + 1}`
            }`,
          };
        }
      });

      const tripImagesData = await Promise.all(imagePromises);
      const imagesMap = {};
      tripImagesData.forEach((item) => {
        imagesMap[item.tripId] = item.imageUrl;
      });
      setTripImages(imagesMap);
    } catch (error) {
      console.log("Failed to fetch trip images, using placeholders");
    }
  };

  const regions = dashboardData.popularCities.slice(0, 4);
  const currentTrips = [...dashboardData.upcomingTrips, ...dashboardData.previousTrips].slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-lg"
      >
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaPlane className="text-blue-600" /> GlobeTrotter
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-600">Welcome, {user?.firstName || 'User'}!</span>
          
          <div className="relative user-menu">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <FaUser className="text-blue-600" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaCog className="text-gray-500" />
                  Profile Settings
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        ref={bannerRef}
        className="relative mx-4 sm:mx-8 my-6 h-64 sm:h-80 rounded-2xl shadow-xl overflow-hidden"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Explore the World</h1>
            <p className="text-lg sm:text-xl opacity-90">Plan your next adventure with GlobeTrotter</p>
          </div>
        </div>
      </section>

      {/* Route Planner */}
      <div className="px-4 sm:px-8 mb-8">
        <RoutePlanner />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-8 mb-8">
        <div className="relative w-full sm:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips or destinations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <FaTh /> Group by
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <FaFilter /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <FaSort /> Sort
          </button>
        </div>
      </div>

      {/* Top Destinations */}
      <section className="px-4 sm:px-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🌟 Popular Destinations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((city, i) => (
            <div
              key={city.id || i}
              ref={(el) => (topRegionsRef.current[i] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div
                className="w-full h-32 sm:h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundImage: city.imageUrl ? `url(${city.imageUrl})` : `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!city.imageUrl && (city.name || `City ${i + 1}`)}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {city.name || `City ${i + 1}`}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{city.country}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {city.popularity}% Popular
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Trips */}
      <section className="px-4 sm:px-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✈️ My Trips</h2>
          <Link
            to="/userTrip"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View All →
          </Link>
        </div>
        {currentTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTrips.map((trip, i) => (
              <div
                key={trip.id || i}
                ref={(el) => (tripsRef.current[i] = el)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div
                  className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    backgroundImage: tripImages[trip.id || i] ? `url(${tripImages[trip.id || i]})` : `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!tripImages[trip.id || i] && (trip.name || `Trip ${i + 1}`)}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{trip.name || `Trip ${i + 1}`}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trip.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status || 'planned'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(trip.start_date || trip.startDate).toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{new Date(trip.end_date || trip.endDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        {Math.ceil((new Date(trip.end_date || trip.endDate) - new Date(trip.start_date || trip.startDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                      {trip.cities && trip.cities.length > 0 && (
                        <span className="text-blue-600">
                          {trip.cities.length} {trip.cities.length === 1 ? 'city' : 'cities'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {trip.budget && (
                    <div className="text-sm font-medium text-green-600 mb-3">
                      Budget: ${trip.budget.toLocaleString()}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/trip/${trip.id}/map`}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View Route Map"
                    >
                      <FaRoute />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaSuitcase className="text-6xl text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Create Your First Trip
            </Link>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section className="px-4 sm:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.popularCities.slice(0, 3).map((city, idx) => (
            <div key={city.id || idx} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundImage: city.imageUrl ? `url(${city.imageUrl})` : `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!city.imageUrl && (city.name?.charAt(0) || "C")}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{city.name}</h3>
                  <p className="text-gray-600 text-sm">{city.country}</p>
                  <div className="text-xs text-blue-600 font-medium">
                    {city.popularity}% popularity
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <Link to="/new">
        <button
          ref={buttonRef}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <FaPlus className="text-xl" />
        </button>
      </Link>
    </div>
  );
};

export default MainLanding;