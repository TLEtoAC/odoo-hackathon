import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Trips API
export const tripsAPI = {
  create: (tripData) => api.post('/trips', tripData),
  getUserTrips: (params) => api.get('/trips/my-trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
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
};

export default api;