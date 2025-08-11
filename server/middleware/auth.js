const passport = require('passport');

// Authentication middleware using Passport
const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    message: 'Access denied. Please log in.'
  });
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  // User is already set by Passport if authenticated
  next();
};

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  
  res.status(403).json({
    success: false,
    message: 'Access denied. Admin privileges required.'
  });
};

// Helper function to get current user
const getCurrentUser = (req) => {
  return req.user || null;
};

module.exports = {
  auth,
  optionalAuth,
  adminAuth,
  getCurrentUser
};
