import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { tripsAPI, exploreAPI } from '../services/api';

const CreateNewTrip = () => {
  const formRef = useRef(null);
  const suggestionRefs = useRef([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', startDate: '', endDate: '', budget: '' });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    gsap.from(formRef.current, { y: -60, opacity: 0, duration: 1.2, ease: "power3.out" });
    gsap.from(suggestionRefs.current, { y: 80, opacity: 0, scale: 0.95, duration: 1, ease: "back.out(1.7)", stagger: 0.1, delay: 0.5 });
    fetchSuggestions();
  }, []);
  
  const fetchSuggestions = async () => {
    try {
      const response = await exploreAPI.getPopularCities({ limit: 6 });
      setSuggestions(response.data.data.cities || []);
    } catch (error) { /* ignore */ }
  };
  
  const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripsAPI.create(formData);
      navigate('/main');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create trip');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div ref={formRef} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-1 text-gray-900">Create a New Trip</h2>
        <p className="text-gray-500 mb-6">Fill in the basic details below to get started. You can add stops and activities later.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Summer in Europe" className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <p className="text-xs text-gray-500 mt-1">A short memorable name for your trip.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget (optional)</label>
              <input name="budget" type="number" value={formData.budget} onChange={handleInputChange} placeholder="e.g., 5000" className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">Approximate total budget in USD.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Tell us about your plans..." className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition">Create Trip</button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Popular Destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((city, i) => (
          <div key={city.id} ref={(el) => (suggestionRefs.current[i] = el)} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-3" />
            <div className="font-semibold text-gray-900">{city.name}</div>
            <div className="text-sm text-gray-600">{city.country}</div>
            <button onClick={() => setFormData({ ...formData, description: `Trip to ${city.name}, ${city.country}` })} className="mt-3 text-blue-600 hover:underline text-sm">Use as inspiration</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewTrip;
