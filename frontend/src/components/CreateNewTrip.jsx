import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { tripsAPI, exploreAPI } from "../services/api";

const CreateNewTrip = () => {
  const formRef = useRef(null);
  const suggestionRefs = useRef([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", description: "", startDate: "", endDate: "", budget: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form animation on mount
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    fetchSuggestions();
  }, []);

  // Animate suggestions when loaded
  useEffect(() => {
    if (suggestionRefs.current.length > 0) {
      gsap.fromTo(
        suggestionRefs.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", stagger: 0.1 }
      );
    }
  }, [suggestions]);

  const fetchSuggestions = async () => {
    try {
      const response = await exploreAPI.getPopularCities({ limit: 6 });
      setSuggestions(response.data.data.cities || []);
    } catch {
      /* ignore */
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate dates
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End date must be after start date");
      return;
    }
    
    setLoading(true);
    try {
      const tripData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        currency: 'USD'
      };
      
      console.log('Creating trip with data:', tripData);
      await tripsAPI.create(tripData);
      navigate("/main");
    } catch (error) {
      console.error('Trip creation error:', error);
      setError(error.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Trip Form */}
      <div
        ref={formRef}
        className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-2 text-gray-900">🌍 Create a New Trip</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Fill in the basic details to get started. You can add stops and activities later.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Trip Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer in Europe"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">A short memorable name for your trip.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget (optional)</label>
              <input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Approximate total budget in USD.</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us about your plans..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </form>
      </div>

      {/* Suggestions */}
      <h2 className="text-xl font-semibold mt-12 mb-6">🔥 Popular Destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {suggestions.map((city, i) => (
          <div
            key={city.id}
            ref={(el) => (suggestionRefs.current[i] = el)}
            className="bg-white rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 border border-gray-100 transition overflow-hidden"
          >
            {city.imageUrl ? (
              <img src={city.imageUrl} alt={city.name} className="w-full h-28 object-cover" />
            ) : (
              <div className="h-28 bg-gradient-to-br from-blue-400 to-purple-500" />
            )}
            <div className="p-4">
              <div className="font-semibold text-gray-900">{city.name}</div>
              <div className="text-sm text-gray-600">{city.country}</div>
              <button
                onClick={() =>
                  setFormData({ ...formData, description: `Trip to ${city.name}, ${city.country}` })
                }
                className="mt-3 inline-block text-blue-600 hover:underline text-sm"
              >
                Use as inspiration
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewTrip;
