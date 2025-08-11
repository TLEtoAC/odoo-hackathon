const express = require('express');
const { body } = require('express-validator');
const budgetController = require('../controllers/budgetController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All budget routes require authentication
router.use(auth);

// Validation rules
const updateBudgetValidation = [
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number')
];

// Get trip budget breakdown
router.get('/:tripId', budgetController.getTripBudgetBreakdown);

// Update trip budget
router.put('/:tripId', updateBudgetValidation, validate, budgetController.updateTripBudget);

module.exports = router;
