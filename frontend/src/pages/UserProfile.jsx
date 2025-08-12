import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { tripsAPI, integrationsAPI } from "../services/api";
import EditProfile from "../components/EditProfile";
import { FaUser, FaEdit, FaCalendar, FaDollarSign, FaMapMarkerAlt, FaPlus, FaRoute } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const profileRef = useRef(null);
  const tripsRef = useRef([]);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [tripImages, setTripImages] = useState({});
  const [loadingTrips, setLoadingTrips] = useState(false);

  tripsRef.current = [];

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    setLoadingTrips(true);
    try {
      const res = await tripsAPI.getUserTrips();
      const trips = res?.data?.data?.trips || [];
      const now = new Date();
      
      const upcoming = [];
      const completed = [];
      
      trips.forEach((trip) => {
        const endDate = trip.endDate ? new Date(trip.endDate) : null;
        const status = (trip.status || '').toLowerCase();
        
        if (status === 'completed' || (endDate && endDate < now)) {
          completed.push(trip);
        } else {
          upcoming.push(trip);
        }
      });

      setUpcomingTrips(upcoming);
      setPreviousTrips(completed);

      // Fetch images for trips
      if (trips.length > 0) {
        fetchTripImages(trips.slice(0, 8)); // Limit to 8 for performance
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchTripImages = async (trips) => {
    try {
      const imagePromises = trips.map(async (trip, index) => {
        try {
          const query = trip.destinations?.[0] || trip.name || 'travel destination';
          const res = await integrationsAPI.searchImages({ 
            query: `${query} travel`, 
            per_page: 1 
          });
          return {
            tripId: trip.id,
            imageUrl: res?.data?.data?.results?.[0]?.urls?.regular || null
          };
        } catch {
          return { tripId: trip.id, imageUrl: null };
        }
      });

      const results = await Promise.all(imagePromises);
      const imagesMap = {};
      results.forEach(({ tripId, imageUrl }) => {
        if (imageUrl) imagesMap[tripId] = imageUrl;
      });
      setTripImages(imagesMap);
    } catch (error) {
      console.error('Error fetching trip images:', error);
    }
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return "Dates TBD";
    try {
      return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
    } catch {
      return "Dates TBD";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/main" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div
          ref={profileRef}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">
                {user ? `${user.firstName} ${user.lastName}` : "User Name"}
              </h2>
              <p className="text-blue-100 mb-4">{user?.email || "user@example.com"}</p>
              {user?.bio && (
                <p className="text-white/90 mb-4">{user.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{upcomingTrips.length + previousTrips.length} trips planned</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{upcomingTrips.length}</div>
            <div className="text-gray-600">Upcoming Trips</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{previousTrips.length}</div>
            <div className="text-gray-600">Completed Trips</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {upcomingTrips.length + previousTrips.length}
            </div>
            <div className="text-gray-600">Total Adventures</div>
          </div>
        </div>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🚀 Upcoming Adventures</h3>
              <Link
                to="/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Plan New Trip
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((trip, i) => (
                <div
                  key={trip.id}
                  ref={(el) => (tripsRef.current[i] = el)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <img
                    src={
                      tripImages[trip.id] ||
                      `https://placehold.co/400x200/93C5FD/1E40AF?text=${encodeURIComponent(trip.name || 'Trip')}`
                    }
                    alt={trip.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-2">{trip.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <FaCalendar />
                      <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </div>
                    {trip.budget && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                        <FaDollarSign />
                        <span>Budget: ${trip.budget}</span>
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
                      >
                        <FaRoute />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Trips */}
        {previousTrips.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📸 Travel Memories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousTrips.map((trip, i) => (
                <div
                  key={trip.id}
                  ref={(el) => (tripsRef.current[upcomingTrips.length + i] = el)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <img
                    src={
                      tripImages[trip.id] ||
                      `https://placehold.co/400x200/9CA3AF/111827?text=${encodeURIComponent(trip.name || 'Trip')}`
                    }
                    alt={trip.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-2">{trip.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <FaCalendar />
                      <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </div>
                    {trip.budget && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                        <FaDollarSign />
                        <span>Budget: ${trip.budget}</span>
                      </div>
                    )}
                    <Link
                      to={`/trip/${trip.id}`}
                      className="block w-full bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      View Memories
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingTrips && upcomingTrips.length === 0 && previousTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Plan Your First Trip
            </Link>
          </div>
        )}

        {loadingTrips && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your trips...</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
};

export default UserProfile;