const express = require('express');
const { body } = require('express-validator');
const itineraryController = require('../controllers/itineraryController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All itinerary routes require authentication
router.use(auth);

// Validation rules
const stopValidation = [
  body('cityId').isInt().withMessage('City ID must be a valid integer'),
  body('arrivalDate').isISO8601().withMessage('Arrival date must be a valid date'),
  body('departureDate').isISO8601().withMessage('Departure date must be a valid date'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
  body('notes').optional().isString().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
];

const activityValidation = [
  body('activityId').isInt().withMessage('Activity ID must be a valid integer'),
  body('startTime').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').isISO8601().withMessage('End time must be a valid date'),
  body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

const updateStopValidation = [
  body('arrivalDate').isISO8601().withMessage('Arrival date must be a valid date'),
  body('departureDate').isISO8601().withMessage('Departure date must be a valid date'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
  body('notes').optional().isString().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
];

const updateActivityValidation = [
  body('startTime').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').isISO8601().withMessage('End time must be a valid date'),
  body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

const reorderValidation = [
  body('stopIds').isArray().withMessage('stopIds must be an array'),
  body('stopIds.*').isInt().withMessage('Each stop ID must be a valid integer')
];

// Get trip itinerary
router.get('/:tripId', itineraryController.getTripItinerary);

// Add stop to itinerary
router.post('/:tripId/stops', stopValidation, validate, itineraryController.addStopToItinerary);

// Update itinerary stop
router.put('/:tripId/stops/:stopId', updateStopValidation, validate, itineraryController.updateItineraryStop);

// Remove stop from itinerary
router.delete('/:tripId/stops/:stopId', itineraryController.removeStopFromItinerary);

// Add activity to stop
router.post('/:tripId/stops/:stopId/activities', activityValidation, validate, itineraryController.addActivityToStop);

// Update trip activity
router.put('/:tripId/stops/:stopId/activities/:activityId', updateActivityValidation, validate, itineraryController.updateTripActivity);

// Remove activity from stop
router.delete('/:tripId/stops/:stopId/activities/:activityId', itineraryController.removeActivityFromStop);

// Reorder stops in itinerary
router.put('/:tripId/reorder', reorderValidation, validate, itineraryController.reorderItineraryStops);

module.exports = router;
