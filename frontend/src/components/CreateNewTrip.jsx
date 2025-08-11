import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { tripsAPI, exploreAPI } from '../services/api';

const CreateNewTrip = () => {
  const formRef = useRef(null);
  const suggestionRefs = useRef([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Animate form with enhanced timing
    gsap.from(formRef.current, { 
      y: -60, 
      opacity: 0, 
      duration: 1.5, 
      ease: "power3.out" 
    });

    // Animate suggestion cards with better effects
    gsap.from(suggestionRefs.current, {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: "back.out(1.7)",
      stagger: 0.15,
      delay: 0.8,
    });
    
    // Fetch popular cities for suggestions
    fetchSuggestions();
  }, []);
  
  const fetchSuggestions = async () => {
    try {
      const response = await exploreAPI.getPopularCities({ limit: 6 });
      setSuggestions(response.data.data.cities || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripsAPI.create(formData);
      navigate('/main');
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Plan a New Trip */}
      <div
        ref={formRef}
        className="bg-white p-8 rounded-xl shadow-2xl mb-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ✈️ Plan a New Trip
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
              <input
                name="name"
                placeholder="Enter trip name..."
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <input
                name="budget"
                type="number"
                placeholder="Enter budget..."
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Describe your trip..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🚀 Create Trip
          </button>
        </form>
      </div>

      {/* Suggestions */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🌍 Popular Destinations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((city, i) => (
          <div
            key={city.id}
            ref={(el) => (suggestionRefs.current[i] = el)}
            className="bg-white p-6 rounded-xl shadow-lg h-48 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            onClick={() => setFormData({...formData, description: `Trip to ${city.name}, ${city.country}`})}
          >
            <div className="h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{city.name?.charAt(0)}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {city.name}
            </h3>
            <p className="text-gray-600 mb-2 font-medium">
              {city.country}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Popularity: {city.popularity}%
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Click to select
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewTrip;
