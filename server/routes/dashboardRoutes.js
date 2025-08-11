const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

// Get dashboard data
router.get('/', dashboardController.getDashboardData);

// Get trip statistics
router.get('/stats', dashboardController.getTripStats);

// Get budget overview
router.get('/budget', dashboardController.getBudgetOverview);

module.exports = router;
