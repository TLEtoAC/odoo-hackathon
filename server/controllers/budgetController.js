const { Trip, TripStop, TripActivity, Activity } = require('../modules');
const { Op } = require('sequelize');
const moment = require('moment');

// Get trip budget breakdown
const getTripBudgetBreakdown = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const tripStops = await TripStop.findAll({
      where: { tripId },
      include: [
        {
          model: TripActivity,
          as: 'activities',
          include: [
            {
              model: Activity,
              as: 'activity',
              attributes: ['id', 'name', 'type', 'cost', 'currency']
            }
          ]
        }
      ]
    });

    const budgetBreakdown = {
      totalBudget: trip.budget || 0,
      totalEstimatedCost: 0,
      remainingBudget: 0,
      byCategory: {
        accommodation: 0,
        transportation: 0,
        activities: 0,
        food: 0,
        other: 0
      },
      byStop: []
    };

    tripStops.forEach(stop => {
      const stopCost = stop.estimatedCost || 0;
      budgetBreakdown.totalEstimatedCost += stopCost;

      let activityCosts = 0;
      const stopActivities = stop.activities || [];
      
      stopActivities.forEach(tripActivity => {
        const activity = tripActivity.activity;
        if (activity && activity.cost) {
          activityCosts += parseFloat(activity.cost);
          
          switch (activity.type) {
            case 'sightseeing':
            case 'adventure':
            case 'entertainment':
              budgetBreakdown.byCategory.activities += parseFloat(activity.cost);
              break;
            case 'food':
              budgetBreakdown.byCategory.food += parseFloat(activity.cost);
              break;
            case 'transport':
              budgetBreakdown.byCategory.transportation += parseFloat(activity.cost);
              break;
            default:
              budgetBreakdown.byCategory.other += parseFloat(activity.cost);
          }
        }
      });

      budgetBreakdown.byCategory.accommodation += stopCost - activityCosts;

      budgetBreakdown.byStop.push({
        stopId: stop.id,
        arrivalDate: stop.arrivalDate,
        departureDate: stop.departureDate,
        totalCost: stopCost,
        accommodationCost: stopCost - activityCosts,
        activityCost: activityCosts
      });
    });

    budgetBreakdown.remainingBudget = budgetBreakdown.totalBudget - budgetBreakdown.totalEstimatedCost;

    res.json({
      success: true,
      data: {
        trip: {
          id: trip.id,
          name: trip.name,
          budget: trip.budget
        },
        budgetBreakdown
      }
    });
  } catch (error) {
    console.error('Get trip budget breakdown error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update trip budget
const updateTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { budget } = req.body;
    const userId = req.user.id;

    if (!budget || budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number'
      });
    }

    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    await trip.update({ budget });

    res.json({
      success: true,
      message: 'Trip budget updated successfully',
      data: { budget: trip.budget }
    });
  } catch (error) {
    console.error('Update trip budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getTripBudgetBreakdown,
  updateTripBudget
};
