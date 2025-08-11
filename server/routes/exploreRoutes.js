const express = require('express');
const cityController = require('../controllers/cityController');
const activityController = require('../controllers/activityController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// City routes
router.get('/cities/search', optionalAuth, cityController.searchCities);
router.get('/cities/popular', optionalAuth, cityController.getPopularCities);
router.get('/cities/countries', optionalAuth, cityController.getCountries);
router.get('/cities/countries/:countryCode', optionalAuth, cityController.getCitiesByCountry);
router.get('/cities/:cityId', optionalAuth, cityController.getCityById);

// Activity routes
router.get('/activities/search', optionalAuth, activityController.searchActivities);
router.get('/activities/popular', optionalAuth, activityController.getPopularActivities);
router.get('/activities/types', optionalAuth, activityController.getActivityTypes);
router.get('/activities/:activityId', optionalAuth, activityController.getActivityById);

module.exports = router;
