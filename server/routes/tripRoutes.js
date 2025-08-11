const express = require('express');
const { body } = require('express-validator');
const tripController = require('../controllers/tripController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createTripValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Trip name is required and must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateTripValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Trip name must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

// Protected routes (require authentication)
router.post('/', auth, createTripValidation, validate, tripController.createTrip);
router.get('/my-trips', auth, tripController.getUserTrips);
router.get('/:tripId', auth, tripController.getTripById);
router.put('/:tripId', auth, updateTripValidation, validate, tripController.updateTrip);
router.delete('/:tripId', auth, tripController.deleteTrip);

// Public routes (optional authentication)
router.get('/public/explore', optionalAuth, tripController.getPublicTrips);

module.exports = router;
