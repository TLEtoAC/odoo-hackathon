import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Backend server is not running on', API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Trips API
export const tripsAPI = {
  create: (tripData) => api.post('/trips', tripData),
  getUserTrips: (params) => api.get('/trips/my-trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  getPublicTrips: (params) => api.get('/trips/public/explore', { params }),
};

// Itinerary API (for route rendering)
export const itineraryAPI = {
  getItinerary: (tripId) => api.get(`/itinerary/${tripId}`),
};

// Explore API
export const exploreAPI = {
  searchCities: (params) => api.get('/explore/cities/search', { params }),
  getPopularCities: (params) => api.get('/explore/cities/popular', { params }),
  searchActivities: (params) => api.get('/explore/activities/search', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
  getStats: (params) => api.get('/dashboard/stats', { params }),
};

// Integrations API
export const integrationsAPI = {
  getWeather: (params) => api.get('/integrations/weather/current', { params }),
  searchImages: (params) => api.get('/integrations/images/search', { params }),
  geocode: (params) => api.get('/integrations/maps/geocode', { params }),
  searchFlights: (params) => api.get('/integrations/flights/search', { params }),
  route: (params) => api.get('/integrations/maps/route', { params }),
};

export default api;