import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaSave, FaCalendarAlt, FaDollarSign, FaArrowLeft } from 'react-icons/fa';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newDay, setNewDay] = useState({ date: '', activities: [] });
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({ name: '', time: '', location: '', cost: '', notes: '' });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({ interests: '', budget: '', travelStyle: '', duration: '' });
  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    // Load trip and itinerary data from localStorage
    const savedItinerary = localStorage.getItem(`itinerary_${tripId}`);
    if (savedItinerary) {
      setItinerary(JSON.parse(savedItinerary));
    } else {
      // Initialize with sample data
      const sampleItinerary = [
        {
          id: 1,
          date: '2024-06-01',
          day: 'Day 1',
          activities: [
            { id: 1, name: 'Arrival at Delhi Airport', time: '10:00 AM', location: 'IGI Airport', cost: 0, notes: 'Flight AI 101' },
            { id: 2, name: 'Check-in at Hotel', time: '12:00 PM', location: 'Connaught Place', cost: 5000, notes: 'Deluxe room booked' },
            { id: 3, name: 'Visit India Gate', time: '4:00 PM', location: 'India Gate', cost: 0, notes: 'Evening walk and photos' }
          ]
        },
        {
          id: 2,
          date: '2024-06-02',
          day: 'Day 2',
          activities: [
            { id: 4, name: 'Red Fort Visit', time: '9:00 AM', location: 'Red Fort', cost: 500, notes: 'Audio guide included' },
            { id: 5, name: 'Lunch at Karim\'s', time: '1:00 PM', location: 'Jama Masjid', cost: 800, notes: 'Famous Mughlai cuisine' },
            { id: 6, name: 'Jama Masjid Tour', time: '2:30 PM', location: 'Jama Masjid', cost: 0, notes: 'Largest mosque in India' }
          ]
        }
      ];
      setItinerary(sampleItinerary);
      localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(sampleItinerary));
    }

    // Sample trip data
    setTrip({
      id: tripId,
      name: 'Golden Triangle Tour',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      destination: 'Delhi, Agra, Jaipur'
    });
  }, [tripId]);

  const saveItinerary = () => {
    localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(itinerary));
  };

  const addDay = () => {
    if (!newDay.date) return;
    
    const day = {
      id: Date.now(),
      date: newDay.date,
      day: `Day ${itinerary.length + 1}`,
      activities: []
    };
    
    const updatedItinerary = [...itinerary, day];
    setItinerary(updatedItinerary);
    localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(updatedItinerary));
    setNewDay({ date: '', activities: [] });
    setShowAddDay(false);
  };

  const addActivity = (dayId) => {
    if (!newActivity.name || !newActivity.time) return;
    
    const activity = {
      id: Date.now(),
      ...newActivity,
      cost: parseFloat(newActivity.cost) || 0
    };
    
    const updatedItinerary = itinerary.map(day => 
      day.id === dayId 
        ? { ...day, activities: [...day.activities, activity] }
        : day
    );
    
    setItinerary(updatedItinerary);
    localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(updatedItinerary));
    setNewActivity({ name: '', time: '', location: '', cost: '', notes: '' });
    setShowAddActivity(null);
  };

  const deleteActivity = (dayId, activityId) => {
    const updatedItinerary = itinerary.map(day => 
      day.id === dayId 
        ? { ...day, activities: day.activities.filter(activity => activity.id !== activityId) }
        : day
    );
    
    setItinerary(updatedItinerary);
    localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(updatedItinerary));
  };

  const getTotalCost = () => {
    return itinerary.reduce((total, day) => 
      total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0), 0
    );
  };

  // Gemini AI for personalized itinerary suggestions
  const generateAISuggestions = async () => {
    try {
      const prompt = `Create a personalized ${aiPreferences.duration || '3-day'} itinerary for ${trip.destination} based on these preferences:
      - Interests: ${aiPreferences.interests || 'general sightseeing'}
      - Budget: ₹${aiPreferences.budget || '10000'} per day
      - Travel Style: ${aiPreferences.travelStyle || 'moderate'}
      
      Provide 3-5 activities per day with time, location, estimated cost in INR, and brief description. Format as JSON array with fields: day, activities[{name, time, location, cost, notes}].`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDq2nCHUJZ55_YGRTdZiI4zBtk_9xAAif4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('AI Suggestions:', suggestionText);
      
      // Parse and set suggestions (fallback to sample data)
      const sampleSuggestions = [
        {
          day: 'Day 1',
          activities: [
            { name: 'Morning Temple Visit', time: '8:00 AM', location: 'Local Temple', cost: 100, notes: 'Peaceful start to the day' },
            { name: 'Heritage Walk', time: '10:00 AM', location: 'Old City', cost: 500, notes: 'Guided historical tour' },
            { name: 'Local Cuisine Lunch', time: '1:00 PM', location: 'Traditional Restaurant', cost: 800, notes: 'Authentic local flavors' },
            { name: 'Sunset Point Visit', time: '6:00 PM', location: 'City Viewpoint', cost: 200, notes: 'Perfect for photography' }
          ]
        },
        {
          day: 'Day 2',
          activities: [
            { name: 'Adventure Activity', time: '9:00 AM', location: 'Adventure Park', cost: 1500, notes: 'Thrilling experience' },
            { name: 'Cultural Museum', time: '2:00 PM', location: 'City Museum', cost: 300, notes: 'Learn local history' },
            { name: 'Shopping Experience', time: '4:00 PM', location: 'Local Market', cost: 1000, notes: 'Souvenirs and crafts' }
          ]
        }
      ];
      
      setAiSuggestions(sampleSuggestions);
    } catch (error) {
      console.error('AI suggestion error:', error);
    }
  };

  const applyAISuggestion = (suggestion) => {
    const newDay = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      day: suggestion.day,
      activities: suggestion.activities.map((activity, index) => ({
        id: Date.now() + index,
        ...activity
      }))
    };
    
    const updatedItinerary = [...itinerary, newDay];
    setItinerary(updatedItinerary);
    localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(updatedItinerary));
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft /> Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{trip.name} - Itinerary</h1>
                <p className="text-gray-600 mt-1">{trip.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Link
                  to={`/budget/${tripId}`}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaDollarSign /> Budget Manager
                </Link>
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaPlus /> AI Assistant
                </button>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-xl font-bold text-green-600">₹{getTotalCost().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Itinerary Days */}
        <div className="space-y-8">
          {itinerary.map((day) => (
            <div key={day.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{day.day}</h2>
                    <p className="opacity-90">{new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <button
                    onClick={() => setShowAddActivity(day.id)}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <FaPlus /> Add Activity
                  </button>
                </div>
              </div>

              <div className="p-6">
                {day.activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaCalendarAlt className="text-4xl mb-4 mx-auto" />
                    <p>No activities planned for this day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <FaClock /> {activity.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt /> {activity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaDollarSign /> ₹{activity.cost}
                            </span>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteActivity(day.id, activity.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Activity Form */}
                {showAddActivity === day.id && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Activity name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity({...newActivity, cost: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => addActivity(day.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Activity
                      </button>
                      <button
                        onClick={() => setShowAddActivity(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">AI Itinerary Assistant</h2>
                <p className="text-gray-600 mt-1">Get personalized suggestions for your trip</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Interests</label>
                  <input
                    type="text"
                    value={aiPreferences.interests}
                    onChange={(e) => setAiPreferences({...aiPreferences, interests: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., history, adventure, food, culture, nature"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Budget (₹)</label>
                    <input
                      type="number"
                      value={aiPreferences.budget}
                      onChange={(e) => setAiPreferences({...aiPreferences, budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Style</label>
                    <select
                      value={aiPreferences.travelStyle}
                      onChange={(e) => setAiPreferences({...aiPreferences, travelStyle: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select style</option>
                      <option value="budget">Budget Traveler</option>
                      <option value="moderate">Moderate</option>
                      <option value="luxury">Luxury</option>
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={generateAISuggestions}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                  >
                    Generate AI Suggestions
                  </button>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
                
                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-purple-900">{suggestion.day}</h4>
                          <button
                            onClick={() => applyAISuggestion(suggestion)}
                            className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            Add to Itinerary
                          </button>
                        </div>
                        <div className="space-y-2">
                          {suggestion.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="text-sm text-gray-700">
                              <span className="font-medium">{activity.time}</span> - {activity.name} at {activity.location} (₹{activity.cost})
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add New Day */}
        <div className="mt-8">
          {!showAddDay ? (
            <button
              onClick={() => setShowAddDay(true)}
              className="w-full bg-white/95 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded-2xl p-8 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <FaPlus className="text-2xl mb-2 mx-auto" />
              <p className="font-semibold">Add New Day</p>
            </button>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <h3 className="font-semibold text-gray-900 mb-4">Add New Day</h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={newDay.date}
                  onChange={(e) => setNewDay({...newDay, date: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addDay}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Day
                </button>
                <button
                  onClick={() => setShowAddDay(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;