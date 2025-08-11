const express = require('express');
const router = express.Router();

// Mock user for demo
const mockUser = {
  id: 1,
  username: 'demo',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User'
};

// Mock data
const mockTrips = [
  { id: 1, name: 'Paris Adventure', startDate: '2025-09-01', endDate: '2025-09-07', budget: 2000, status: 'planned' },
  { id: 2, name: 'Tokyo Experience', startDate: '2025-10-15', endDate: '2025-10-22', budget: 3000, status: 'planned' }
];

const mockCities = [
  { id: 1, name: 'Paris', country: 'France', popularity: 95, costIndex: 85, images: [] },
  { id: 2, name: 'Tokyo', country: 'Japan', popularity: 90, costIndex: 90, images: [] },
  { id: 3, name: 'New York', country: 'USA', popularity: 88, costIndex: 95, images: [] },
  { id: 4, name: 'London', country: 'UK', popularity: 85, costIndex: 80, images: [] }
];

const mockActivities = [
  { id: 101, name: 'Eiffel Tower Visit', description: 'Iconic landmark', type: 'sightseeing', category: 'landmarks', duration: 120, cost: 25, currency: 'EUR' },
  { id: 102, name: 'Louvre Museum', description: 'World-famous art museum', type: 'culture', category: 'museum', duration: 180, cost: 17, currency: 'EUR' },
  { id: 103, name: 'Seine River Cruise', description: 'Relaxing city views', type: 'relaxation', category: 'cruise', duration: 60, cost: 20, currency: 'EUR' }
];

// Auth routes
router.post('/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully',
    data: { user: mockUser }
  });
});

router.post('/auth/login', (req, res) => {
  req.session.user = mockUser;
  res.json({
    success: true,
    message: 'Login successful',
    data: { user: mockUser }
  });
});

router.get('/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: { user: req.session?.user || mockUser }
  });
});

router.post('/auth/logout', (req, res) => {
  req.session?.destroy?.();
  res.json({ success: true, message: 'Logout successful' });
});

// Trip routes
router.post('/trips', (req, res) => {
  const newTrip = { id: Date.now(), ...req.body, status: 'planned' };
  mockTrips.push(newTrip);
  res.status(201).json({
    success: true,
    message: 'Trip created successfully',
    data: { trip: newTrip }
  });
});

router.get('/trips/my-trips', (req, res) => {
  res.json({
    success: true,
    data: {
      trips: mockTrips,
      pagination: { currentPage: 1, totalPages: 1, totalItems: mockTrips.length }
    }
  });
});

// Dashboard routes
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      upcomingTrips: mockTrips,
      popularCities: mockCities,
      budgetHighlights: { totalBudget: 5000, totalTrips: 2 }
    }
  });
});

// Explore routes
router.get('/explore/cities/popular', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json({
    success: true,
    data: { cities: mockCities.slice(0, limit) }
  });
});

router.get('/explore/cities/search', (req, res) => {
  res.json({
    success: true,
    data: {
      cities: mockCities,
      pagination: { currentPage: 1, totalPages: 1, totalItems: mockCities.length }
    }
  });
});

// Activities search mock
router.get('/explore/activities/search', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const results = q ? mockActivities.filter(a => a.name.toLowerCase().includes(q) || (a.description||'').toLowerCase().includes(q)) : mockActivities;
  res.json({
    success: true,
    data: {
      activities: results,
      pagination: { currentPage: 1, totalPages: 1, totalItems: results.length }
    }
  });
});

// Community mock
router.get('/community', (req, res) => {
  res.json({
    success: true,
    posts: [
      { id: 1, userAvatar: 'https://placehold.co/48', content: 'Loved Paris in spring!' },
      { id: 2, userAvatar: 'https://placehold.co/48', content: 'Tokyo food tour recommendations?' }
    ]
  });
});

module.exports = router;