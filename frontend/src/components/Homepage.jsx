import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaRoute, FaUsers, FaDollarSign, FaGlobe, FaArrowRight } from 'react-icons/fa';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaPlane className="text-blue-600" /> GlobeTrotter
        </h1>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6">
            Transform Your <span className="text-blue-600">Travel Dreams</span> Into Reality
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A personalized, intelligent, and collaborative platform that empowers you to dream, design, 
            and organize trips with ease. Make travel planning as exciting as the trip itself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Start Planning <FaArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything You Need for Perfect Travel Planning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaRoute className="text-4xl text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Itineraries</h3>
              <p className="text-gray-600">Create structured, day-wise travel plans with interactive route visualization</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaDollarSign className="text-4xl text-green-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budget Tracking</h3>
              <p className="text-gray-600">Make cost-effective decisions with automatic budget breakdowns and analysis</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaGlobe className="text-4xl text-purple-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Destinations</h3>
              <p className="text-gray-600">Explore destinations worldwide with detailed city and activity information</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaUsers className="text-4xl text-orange-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Sharing</h3>
              <p className="text-gray-600">Share your travel plans and get inspired by the community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Vision</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We envision a world where users can explore global destinations, visualize their journeys 
            through structured itineraries, make cost-effective decisions, and share their travel plans 
            within a community. GlobeTrotter combines flexibility and interactivity to offer an 
            end-to-end travel planning tool that transforms how individuals plan and experience travel.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-8 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who are already planning their dream trips with GlobeTrotter
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Get Started Free <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 bg-gray-800 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaPlane className="text-blue-400" />
          <span className="text-xl font-bold">GlobeTrotter</span>
        </div>
        <p className="text-gray-400">Making travel planning as exciting as the trip itself</p>
      </footer>
    </div>
  );
};

export default Homepage;