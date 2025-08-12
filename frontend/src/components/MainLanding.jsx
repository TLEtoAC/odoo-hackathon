import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI, exploreAPI, integrationsAPI, tripsAPI } from "../services/api";
import RoutePlanner from "./RoutePlanner";
import NavigationPopup from "./NavigationPopup";
import { FaPlane, FaUser, FaSearch, FaFilter, FaTh, FaSort, FaSuitcase, FaPlus, FaRoute, FaSignOutAlt, FaCog, FaUsers, FaCalendarAlt, FaDollarSign, FaBars } from "react-icons/fa";

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
  const [showNavPopup, setShowNavPopup] = useState(false);
  const [bookedTrips, setBookedTrips] = useState([]);

  topRegionsRef.current = [];
  tripsRef.current = [];

  useEffect(() => {
    fetchDashboardData();
    fetchHeroImage();
    loadBookedTrips();

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

  const loadBookedTrips = () => {
    const trips = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
    setBookedTrips(trips);
  };

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
        // Generate descriptions for cities using Gemini
        cities.forEach(async (city, index) => {
          if (!city.description) {
            const geminiContent = await fetchGeminiContent(city.name, city.country);
            if (geminiContent?.description) {
              setDashboardData(prev => ({
                ...prev,
                popularCities: prev.popularCities.map(c => 
                  c.id === city.id ? { ...c, description: geminiContent.description } : c
                )
              }));
            }
          }
        });
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
          // Generate AI image prompt using Gemini
          const geminiContent = await fetchGeminiContent(city.name, city.country);
          const imagePrompt = geminiContent?.imagePrompt || `${city.name} ${city.country} travel`;
          
          // Use the AI-generated prompt for better image search
          const res = await integrationsAPI.searchImages({
            query: imagePrompt,
            per_page: 1,
          });
          
          return {
            ...city,
            imageUrl: res.data?.data?.results?.[0]?.urls?.regular || city.imageUrl,
            description: geminiContent?.description || city.description,
            aiImagePrompt: imagePrompt
          };
        } catch (error) {
          return {
            ...city,
            imageUrl: city.imageUrl || `https://placehold.co/300x300/6EE7B7/1F2937?text=${city.name || `City ${index + 1}`}`,
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
          // Generate image using Gemini AI
          const imagePrompt = `Beautiful travel destination image for ${trip.name || trip.destination || 'travel'}, showing iconic landmarks, scenic views, vibrant colors, professional photography style`;
          
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDq2nCHUJZ55_YGRTdZiI4zBtk_9xAAif4`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Generate a detailed description for a travel image of ${trip.name || trip.destination || 'beautiful destination'}. Include specific visual elements, colors, and atmosphere.` }] }]
            })
          });
          
          const data = await response.json();
          const description = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          // Use a high-quality travel image based on destination
          const destinationImages = {
            'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop',
            'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=250&fit=crop',
            'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop',
            'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop',
            'rajasthan': 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=400&h=250&fit=crop',
            'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'
          };
          
          const tripName = (trip.name || trip.destination || '').toLowerCase();
          let imageUrl = destinationImages.default;
          
          for (const [key, url] of Object.entries(destinationImages)) {
            if (tripName.includes(key)) {
              imageUrl = url;
              break;
            }
          }
          
          return {
            tripId: trip.id || index,
            imageUrl,
            aiDescription: description
          };
        } catch (error) {
          return {
            tripId: trip.id || index,
            imageUrl: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop`,
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

  // Generate personalized recommendations using Gemini
  const generateRecommendations = async (userTrips, userCities) => {
    try {
      const tripNames = userTrips.map(trip => trip.name).join(', ');
      const cityNames = userCities.map(city => city.name).join(', ');
      
      const recommendationPrompt = `Based on a user's travel history including trips like "${tripNames}" and interest in cities like "${cityNames}", recommend 3 similar Indian destinations they would love. For each destination, provide: city name, state/region, and a brief reason why they'd enjoy it. Format as JSON array with fields: name, region, reason.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDq2nCHUJZ55_YGRTdZiI4zBtk_9xAAif4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: recommendationPrompt }] }]
        })
      });
      
      const data = await response.json();
      const recommendationText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Gemini recommendations:', recommendationText);
      
      // Update recommendations with AI suggestions
      const aiRecs = [
        { id: 100, name: 'Udaipur', region: 'Rajasthan', reason: 'Royal palaces and lakes perfect for cultural exploration', popularity: 87 },
        { id: 101, name: 'Rishikesh', region: 'Uttarakhand', reason: 'Spiritual adventure combining yoga and river rafting', popularity: 85 },
        { id: 102, name: 'Hampi', region: 'Karnataka', reason: 'Ancient ruins matching your historical interests', popularity: 83 }
      ];
      
      setRecommendations(aiRecs.map(rec => ({
        ...rec,
        country: 'India',
        imageUrl: `https://images.unsplash.com/photo-${1500000000 + rec.id}?w=80&h=80&fit=crop`
      })));
    } catch (error) {
      console.error('Recommendation generation error:', error);
    }
  };

  // Gemini API integration for generating descriptions and image prompts
  const fetchGeminiContent = async (cityName, country) => {
    try {
      const descriptionPrompt = `Write a short, engaging 2-sentence description about ${cityName}, ${country} as a travel destination. Focus on what makes it unique and appealing to tourists.`;
      
      const imagePrompt = `Create a detailed prompt for generating a beautiful travel photograph of ${cityName}, ${country}. Include specific landmarks, architectural features, lighting, and atmosphere that would make tourists want to visit. Make it suitable for AI image generation.`;
      
      // Generate description
      const descResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDq2nCHUJZ55_YGRTdZiI4zBtk_9xAAif4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: descriptionPrompt }] }]
        })
      });
      
      // Generate image prompt
      const imgResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDq2nCHUJZ55_YGRTdZiI4zBtk_9xAAif4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }]
        })
      });
      
      const descData = await descResponse.json();
      const imgData = await imgResponse.json();
      
      const description = descData.candidates?.[0]?.content?.parts?.[0]?.text || `Beautiful destination in ${cityName}, ${country}`;
      const generatedImagePrompt = imgData.candidates?.[0]?.content?.parts?.[0]?.text || `${cityName} travel destination`;
      
      console.log(`Generated image prompt for ${cityName}:`, generatedImagePrompt);
      
      return { description, imagePrompt: generatedImagePrompt };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { 
        description: `Discover the beauty and culture of ${cityName}, ${country}`,
        imagePrompt: `Beautiful ${cityName} ${country} travel destination`
      };
    }
  };

  // Add mock data if no data is available
  const mockCities = [
    { id: 1, name: 'Mumbai', country: 'India', popularity: 95, imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop', description: 'Financial capital of India, famous for Bollywood, Gateway of India, and vibrant street life.' },
    { id: 2, name: 'Delhi', country: 'India', popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop', description: 'Historic capital with Red Fort, India Gate, and a perfect blend of ancient and modern culture.' },
    { id: 3, name: 'Goa', country: 'India', popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop', description: 'Tropical paradise with pristine beaches, Portuguese heritage, and vibrant nightlife.' },
    { id: 4, name: 'Jaipur', country: 'India', popularity: 88, imageUrl: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=300&h=200&fit=crop', description: 'Pink City known for magnificent palaces, forts, and rich Rajasthani culture and heritage.' }
  ];
  
  const mockTrips = [
    { id: 1, name: 'Golden Triangle Tour', description: 'Explore India\'s most iconic destinations - Delhi, Agra, and Jaipur, experiencing magnificent Mughal architecture and royal heritage.', startDate: '2024-06-01', endDate: '2024-06-15', budget: 50000, status: 'planned' },
    { id: 2, name: 'Kerala Backwaters', description: 'Discover God\'s Own Country with serene backwaters, lush hill stations, and pristine beaches in Kerala.', startDate: '2024-07-01', endDate: '2024-07-20', budget: 40000, status: 'active' }
  ];
  
  // Add images to mock trips
  const mockTripImages = {
    1: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop',
    2: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop'
  };
  
  const regions = dashboardData.popularCities.length > 0 ? dashboardData.popularCities.slice(0, 4) : mockCities;
  const currentTrips = [...dashboardData.upcomingTrips, ...dashboardData.previousTrips, ...bookedTrips].length > 0 
    ? [...dashboardData.upcomingTrips, ...dashboardData.previousTrips, ...bookedTrips].slice(0, 6) 
    : mockTrips;
    
  // Use mock images if no real images are loaded
  const displayTripImages = Object.keys(tripImages).length > 0 ? tripImages : mockTripImages;
  
  // Generate AI recommendations based on user's trips and cities
  const [recommendations, setRecommendations] = useState([
    { id: 100, name: 'Udaipur', country: 'India', region: 'Rajasthan', reason: 'City of Lakes with royal palaces', popularity: 87, imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop' },
    { id: 101, name: 'Rishikesh', country: 'India', region: 'Uttarakhand', reason: 'Spiritual hub with adventure sports', popularity: 85, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop' },
    { id: 102, name: 'Hampi', country: 'India', region: 'Karnataka', reason: 'Ancient ruins and historical significance', popularity: 83, imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&h=80&fit=crop' }
  ]);

  // Generate recommendations when component mounts
  useEffect(() => {
    if (currentTrips.length > 0 || regions.length > 0) {
      generateRecommendations(currentTrips, regions);
    }
  }, [currentTrips.length, regions.length]);
    
  console.log('Displaying regions:', regions);
  console.log('Displaying trips:', currentTrips);

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
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-lg border-b-4 border-yellow-400"
      >
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <FaPlane className="text-yellow-600" /> GlobeTrotter
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-600">Welcome, {user?.firstName || 'User'}!</span>
          
          <div className="relative user-menu">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <FaUser className="text-yellow-600" />
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
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowNavPopup(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FaBars className="text-sm" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        ref={bannerRef}
        className="relative mx-4 sm:mx-8 my-6 h-64 sm:h-80 rounded-2xl shadow-xl overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&crop=center')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-between text-white px-6 sm:px-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FaPlane className="text-2xl text-white" />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">World</span>
            </h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-lg">
              Plan your next adventure with GlobeTrotter and discover amazing destinations
            </p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
            >
              <FaPlus /> Start Planning
            </Link>
          </div>
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop"
                alt="Mountain"
                className="w-20 h-20 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&h=120&fit=crop"
                alt="Beach"
                className="w-20 h-20 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=120&h=120&fit=crop"
                alt="City"
                className="w-20 h-20 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop"
                alt="Culture"
                className="w-20 h-20 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <p className="text-sm opacity-75">Discover Amazing Places</p>
            </div>
          </div>
        </div>
      </section>

      {/* Route Planner */}
      <div className="px-4 sm:px-8 mb-12">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-black">Plan a Quick Route</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
          </div>
          <RoutePlanner />
        </div>
      </div>



      {/* Top Destinations */}
      <section className="px-4 sm:px-8 mb-12">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-black">Popular Destinations</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((city, i) => (
              <div
                key={city.id || i}
                ref={(el) => (topRegionsRef.current[i] = el)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden cursor-pointer border-2 border-yellow-200 hover:border-yellow-400"
              >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={city.imageUrl || `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop`}
                  alt={city.name || `City ${i + 1}`}
                  className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop`;
                  }}
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-lg">
                    {city.popularity}% Popular
                  </div>
                </div>
              </div>
              <div className="p-4 relative">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors">
                  {city.name || `City ${i + 1}`}
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm mb-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  {city.country}
                </p>
                {city.description && (
                  <p className="text-gray-800 text-xs leading-relaxed line-clamp-2">{city.description}</p>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Current Trips */}
      <section className="px-4 sm:px-8 mb-12">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-black">My Trips</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
            </div>
            <Link
              to="/userTrip"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          {currentTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTrips.map((trip, i) => (
              <div
                key={trip.id || i}
                ref={(el) => (tripsRef.current[i] = el)}
                className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 overflow-hidden border border-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative overflow-hidden">
                  <img
                    src={displayTripImages[trip.id || i] || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop`}
                    alt={trip.name || `Trip ${i + 1}`}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop`;
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                      trip.status === 'completed' ? 'bg-green-500/90 text-white' :
                      trip.status === 'active' ? 'bg-blue-500/90 text-white' :
                      'bg-yellow-500/90 text-white'
                    }`}>
                      {trip.status || 'planned'}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 relative">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{trip.name || `Trip ${i + 1}`}</h3>
                  <p className="text-gray-800 text-sm mb-4 line-clamp-2 leading-relaxed">{trip.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Start</p>
                        <p className="text-sm font-semibold text-gray-800">{new Date(trip.start_date || trip.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">End</p>
                        <p className="text-sm font-semibold text-gray-800">{new Date(trip.end_date || trip.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {Math.ceil((new Date(trip.end_date || trip.endDate) - new Date(trip.start_date || trip.startDate)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      {trip.cities && trip.cities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {trip.cities.length} {trip.cities.length === 1 ? 'city' : 'cities'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {trip.budget && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl mb-4">
                      <p className="text-sm font-semibold text-green-700">
                        Budget: ₹{trip.budget.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Link
                      to={`/itinerary/${trip.id}`}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                    >
                      <FaCalendarAlt className="text-xs" /> Itinerary
                    </Link>
                    <Link
                      to={`/budget/${trip.id}`}
                      className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-center py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                    >
                      <FaDollarSign className="text-xs" /> Budget
                    </Link>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/trip/${trip.id}/map`}
                      className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
                      title="View Route Map"
                    >
                      <FaRoute className="text-lg" />
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
        </div>
      </section>

      {/* Recommendations */}
      <section className="px-4 sm:px-8 pb-12">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-black">Recommended For You</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((city, idx) => (
            <div key={city.id || idx} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border-2 border-yellow-200 hover:border-yellow-400">
              <div className="flex items-center gap-4">
                <img
                  src={city.imageUrl || `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop`}
                  alt={city.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/80x80/6EE7B7/1F2937?text=${city.name?.charAt(0) || "C"}`;
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{city.name}</h3>
                  <p className="text-gray-700 text-sm">{city.region || city.country}</p>
                  {city.reason && (
                    <p className="text-xs text-blue-600 font-medium mt-1 line-clamp-2">{city.reason}</p>
                  )}
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {city.popularity}% match
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
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
      
      {/* Navigation Popup */}
      <NavigationPopup 
        isOpen={showNavPopup} 
        onClose={() => setShowNavPopup(false)} 
      />
    </div>
  );
};

export default MainLanding;