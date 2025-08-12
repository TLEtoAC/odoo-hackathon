import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaPlane, FaUsers, FaMapMarkerAlt, FaStar, FaGlobe, FaArrowRight, FaPlay } from 'react-icons/fa';

const StartingPage = () => {
  const heroRef = useRef(null);
  const statsRef = useRef([]);
  const featuresRef = useRef([]);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: '50K+', label: 'Happy Travelers', icon: FaUsers, color: 'from-blue-500 to-cyan-500' },
    { number: '200+', label: 'Destinations', icon: FaMapMarkerAlt, color: 'from-green-500 to-emerald-500' },
    { number: '4.9', label: 'Average Rating', icon: FaStar, color: 'from-yellow-500 to-orange-500' },
    { number: '100+', label: 'Countries', icon: FaGlobe, color: 'from-purple-500 to-pink-500' }
  ];

  const features = [
    {
      title: 'Smart Itinerary Planning',
      description: 'AI-powered trip planning that adapts to your preferences and budget',
      icon: '🧠',
      gradient: 'from-blue-400 to-purple-600'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Plan trips with friends and family in real-time with live updates',
      icon: '👥',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      title: 'Budget Optimization',
      description: 'Smart budget tracking and cost optimization for maximum value',
      icon: '💰',
      gradient: 'from-yellow-400 to-red-500'
    }
  ];

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    // Stats animation
    gsap.fromTo(statsRef.current,
      { opacity: 0, y: 30, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        delay: 0.5,
        ease: "back.out(1.7)" 
      }
    );

    // Features animation
    gsap.fromTo(featuresRef.current,
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 1, 
        stagger: 0.3, 
        delay: 1,
        ease: "power2.out" 
      }
    );

    // Stats counter animation
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaPlane className="text-3xl text-blue-400 transform rotate-45" />
            <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-md"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GlobeTrotter
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 text-white/80 hover:text-white transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={heroRef} className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Plan Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dream Trip
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Transform your travel dreams into reality with our AI-powered trip planning platform. 
                Discover, plan, and share unforgettable adventures.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/entry"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 font-semibold text-lg flex items-center justify-center gap-3"
              >
                Start Planning
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group px-8 py-4 border border-white/20 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3">
                <FaPlay className="text-blue-400" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  ref={el => statsRef.current[index] = el}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                  <div className="relative z-10">
                    <stat.icon className="text-3xl text-white/80 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>

            {/* Featured Stat */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
              <div className="relative z-10 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stats[currentStat].number}
                </div>
                <div className="text-white/80 text-lg">{stats[currentStat].label}</div>
                <div className="mt-4 flex justify-center">
                  {stats.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                        index === currentStat ? 'bg-blue-400 w-8' : 'bg-white/30'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose GlobeTrotter?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of travel planning with our cutting-edge features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featuresRef.current[index] = el}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>

              {/* Hover glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-20 text-center">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have already discovered the joy of seamless trip planning
            </p>
            
            <Link
              to="/entry"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 font-semibold text-lg"
            >
              Get Started Free
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StartingPage;