# 🌍 GlobeTrotter Frontend Integration Guide

This guide provides comprehensive information for frontend developers to integrate with the GlobeTrotter backend API.

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file in your frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 2. API Service Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000'),
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Authentication Flow

### Registration
```javascript
const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.success) {
      // User registered successfully
      return { success: true, user: response.data.data.user };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};
```

### Login
```javascript
const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.success) {
      // User logged in successfully
      return { success: true, user: response.data.data.user };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};
```

### Logout
```javascript
const logout = async () => {
  try {
    await api.post('/api/auth/logout');
    // Clear local user state
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Logout failed' 
    };
  }
};
```

## 📊 Dashboard Integration

### Get Dashboard Data
```javascript
const getDashboardData = async () => {
  try {
    const response = await api.get('/api/dashboard');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};

// Usage
const dashboardData = await getDashboardData();
const { upcomingTrips, recentTrips, popularCities, budgetHighlights } = dashboardData;
```

### Dashboard Data Structure
```javascript
{
  upcomingTrips: [
    {
      id: 1,
      name: "European Adventure",
      startDate: "2024-06-01",
      endDate: "2024-06-15",
      budget: 5000,
      status: "planned",
      cities: [
        { id: 1, name: "Paris", country: "France", countryCode: "FRA" }
      ]
    }
  ],
  recentTrips: [...],
  popularCities: [
    {
      id: 1,
      name: "Paris",
      country: "France",
      countryCode: "FRA",
      costIndex: 85,
      popularity: 95,
      image: "paris1.jpg"
    }
  ],
  budgetHighlights: {
    totalBudget: 15000,
    upcomingBudget: 8000,
    averageBudgetPerTrip: 5000,
    totalTrips: 3,
    totalCities: 8
  }
}
```

## 🗺️ Trip Management

### Create Trip
```javascript
const createTrip = async (tripData) => {
  try {
    const response = await api.post('/api/trips', tripData);
    return { success: true, trip: response.data.data.trip };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to create trip' 
    };
  }
};

// Usage
const newTrip = await createTrip({
  name: "Summer in Europe",
  startDate: "2024-06-01",
  endDate: "2024-06-30",
  description: "Exploring European cities",
  budget: 8000
});
```

### Get User Trips
```javascript
const getUserTrips = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/api/trips/my-trips?${params}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    throw error;
  }
};

// Usage
const trips = await getUserTrips({ 
  page: 1, 
  limit: 10, 
  status: 'planned' 
});
```

### Trip Data Structure
```javascript
{
  trips: [
    {
      id: 1,
      name: "European Adventure",
      description: "Exploring Europe's finest cities",
      startDate: "2024-06-01",
      endDate: "2024-06-15",
      budget: 5000,
      status: "planned",
      isPublic: false,
      stops: [
        {
          id: 1,
          city: { id: 1, name: "Paris", country: "France" },
          arrivalDate: "2024-06-01",
          departureDate: "2024-06-04",
          estimatedCost: 800
        }
      ]
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10
  }
}
```

## 🗓️ Itinerary Management

### Get Trip Itinerary
```javascript
const getTripItinerary = async (tripId) => {
  try {
    const response = await api.get(`/api/itinerary/${tripId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch itinerary:', error);
    throw error;
  }
};
```

### Add Stop to Itinerary
```javascript
const addStopToItinerary = async (tripId, stopData) => {
  try {
    const response = await api.post(`/api/itinerary/${tripId}/stops`, stopData);
    return { success: true, stop: response.data.data.stop };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add stop' 
    };
  }
};

// Usage
const newStop = await addStopToItinerary(1, {
  cityId: 2,
  arrivalDate: "2024-06-05",
  departureDate: "2024-06-08",
  estimatedCost: 600,
  notes: "Stay in city center"
});
```

### Add Activity to Stop
```javascript
const addActivityToStop = async (tripId, stopId, activityData) => {
  try {
    const response = await api.post(
      `/api/itinerary/${tripId}/stops/${stopId}/activities`, 
      activityData
    );
    return { success: true, activity: response.data.data.activity };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add activity' 
    };
  }
};

// Usage
const newActivity = await addActivityToStop(1, 1, {
  activityId: 5,
  startTime: "2024-06-01T14:00:00.000Z",
  endTime: "2024-06-01T16:00:00.000Z",
  notes: "Book tickets in advance"
});
```

### Itinerary Data Structure
```javascript
{
  trip: {
    id: 1,
    name: "European Adventure",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    budget: 5000,
    status: "planned"
  },
  itinerary: [
    {
      date: "2024-06-01",
      stops: [
        {
          type: "arrival",
          stop: {
            id: 1,
            city: { id: 1, name: "Paris", country: "France" },
            arrivalDate: "2024-06-01",
            departureDate: "2024-06-04",
            estimatedCost: 800,
            notes: "Stay in Montmartre area",
            activities: [
              {
                id: 1,
                startTime: "2024-06-01T14:00:00.000Z",
                endTime: "2024-06-01T16:00:00.000Z",
                notes: "Book tickets in advance",
                activity: {
                  id: 5,
                  name: "Eiffel Tower Visit",
                  type: "sightseeing",
                  cost: 25.00,
                  currency: "EUR"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## 💰 Budget Management

### Get Trip Budget Breakdown
```javascript
const getTripBudget = async (tripId) => {
  try {
    const response = await api.get(`/api/budget/${tripId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch budget:', error);
    throw error;
  }
};
```

### Update Trip Budget
```javascript
const updateTripBudget = async (tripId, budget) => {
  try {
    const response = await api.put(`/api/budget/${tripId}`, { budget });
    return { success: true, budget: response.data.data.budget };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update budget' 
    };
  }
};
```

### Budget Data Structure
```javascript
{
  trip: {
    id: 1,
    name: "European Adventure",
    budget: 5000
  },
  budgetBreakdown: {
    totalBudget: 5000,
    totalEstimatedCost: 3200,
    remainingBudget: 1800,
    byCategory: {
      accommodation: 1800,
      transportation: 400,
      activities: 800,
      food: 200,
      other: 0
    },
    byStop: [
      {
        stopId: 1,
        arrivalDate: "2024-06-01",
        departureDate: "2024-06-04",
        totalCost: 800,
        accommodationCost: 600,
        activityCost: 200
      }
    ]
  }
}
```

## 🔍 City & Activity Discovery

### Search Cities
```javascript
const searchCities = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams(searchParams);
    const response = await api.get(`/api/explore/cities/search?${params}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to search cities:', error);
    throw error;
  }
};

// Usage
const cities = await searchCities({
  q: "paris",
  country: "FRA",
  page: 1,
  limit: 10,
  sortBy: "popularity",
  sortOrder: "DESC"
});
```

### Search Activities
```javascript
const searchActivities = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams(searchParams);
    const response = await api.get(`/api/explore/activities/search?${params}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to search activities:', error);
    throw error;
  }
};

// Usage
const activities = await searchActivities({
  q: "museum",
  type: "sightseeing",
  cityId: 1,
  minCost: 0,
  maxCost: 50,
  page: 1,
  limit: 20
});
```

### Get Popular Cities
```javascript
const getPopularCities = async (limit = 10, country = null) => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (country) params.append('country', country);
    
    const response = await api.get(`/api/explore/cities/popular?${params}`);
    return response.data.data.cities;
  } catch (error) {
    console.error('Failed to fetch popular cities:', error);
    throw error;
  }
};
```

### Get Activity Types
```javascript
const getActivityTypes = async () => {
  try {
    const response = await api.get('/api/explore/activities/types');
    return response.data.data.types;
  } catch (error) {
    console.error('Failed to fetch activity types:', error);
    throw error;
  }
};

// Returns: ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'entertainment', 'relaxation', 'transport', 'other']
```

## 📱 Error Handling

### Standard Error Response Format
```javascript
{
  success: false,
  message: "Error description",
  errors: [
    {
      field: "email",
      message: "Email is required",
      value: ""
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Handling Example
```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Show permission denied message
        toast.error('You do not have permission to perform this action');
        break;
      case 422:
        // Show validation errors
        if (data.errors) {
          data.errors.forEach(err => {
            toast.error(`${err.field}: ${err.message}`);
          });
        }
        break;
      default:
        // Show generic error
        toast.error(data.message || 'An error occurred');
    }
  } else {
    // Network error
    toast.error('Network error. Please check your connection.');
  }
};
```

## 🔄 State Management

### React Context Example
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTrips();
      setTrips(data.trips);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      const result = await createTrip(tripData);
      if (result.success) {
        setTrips(prev => [...prev, result.trip]);
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const value = {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
```

## 🎨 UI Components

### Trip Card Component
```javascript
const TripCard = ({ trip, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{trip.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(trip.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => onEdit(trip.id)}
            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(trip.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{trip.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Dates:</span>
          <p className="text-gray-600">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Budget:</span>
          <p className="text-gray-600">${trip.budget?.toLocaleString()}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            trip.status === 'completed' ? 'bg-green-100 text-green-800' :
            trip.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {trip.status}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Cities:</span>
          <p className="text-gray-600">{trip.stops?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};
```

## 🚀 Performance Tips

### 1. Implement Pagination
Always use pagination for large lists:
```javascript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const data = await getUserTrips({ page, limit: 20 });
  setTrips(prev => [...prev, ...data.trips]);
  setHasMore(data.pagination.currentPage < data.pagination.totalPages);
  setPage(prev => prev + 1);
};
```

### 2. Debounce Search
Implement debounced search for better performance:
```javascript
import { useDebounce } from 'use-debounce';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm) {
    searchCities({ q: debouncedSearchTerm });
  }
}, [debouncedSearchTerm]);
```

### 3. Optimistic Updates
Update UI immediately for better user experience:
```javascript
const updateTrip = async (tripId, updates) => {
  // Optimistic update
  setTrips(prev => prev.map(trip => 
    trip.id === tripId ? { ...trip, ...updates } : trip
  ));
  
  try {
    await api.put(`/api/trips/${tripId}`, updates);
  } catch (error) {
    // Revert on error
    fetchTrips();
    toast.error('Failed to update trip');
  }
};
```

## 🔧 Development Tools

### 1. API Testing
Use the provided test script:
```bash
node test-backend.js
```

### 2. Environment Variables
Create different `.env` files for different environments:
```env
# .env.development
REACT_APP_API_URL=http://localhost:5000

# .env.production
REACT_APP_API_URL=https://api.globetrotter.com
```

### 3. Debug Mode
Enable debug mode in development:
```javascript
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(request => {
    console.log('API Request:', request);
    return request;
  });
  
  api.interceptors.response.use(response => {
    console.log('API Response:', response);
    return response;
  });
}
```

## 📚 Additional Resources

- [Backend API Documentation](./README.md)
- [Database Schema](./server/modules/)
- [Validation Rules](./server/middleware/validation.js)
- [Error Handling](./server/middleware/errorHandler.js)

## 🆘 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the backend server is running
3. Check the API endpoint URLs
4. Ensure proper authentication headers
5. Review the validation rules for request data

---

**Happy coding! 🚀** The GlobeTrotter backend is ready to power your amazing frontend experience!
