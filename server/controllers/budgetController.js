const pool = require('../dbPool');
const moment = require('moment');

// Get trip budget breakdown
const getTripBudgetBreakdown = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Fetch trip
    const tripResult = await pool.query(
      `SELECT id, name, budget
       FROM trips
       WHERE id = $1 AND user_id = $2 AND is_active = true`,
      [tripId, userId]
    );

    if (tripResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const trip = tripResult.rows[0];

    // Fetch trip stops with activities
    const stopsResult = await pool.query(
      `
      SELECT ts.id AS stop_id, ts.arrival_date, ts.departure_date, ts.estimated_cost,
             ta.id AS trip_activity_id, a.id AS activity_id, a.name AS activity_name, 
             a.type AS activity_type, a.cost AS activity_cost, a.currency AS activity_currency
      FROM trip_stops ts
      LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
      LEFT JOIN activities a ON a.id = ta.activity_id
      WHERE ts.trip_id = $1
    `,
      [tripId]
    );

    const budgetBreakdown = {
      totalBudget: trip.budget || 0,
      totalEstimatedCost: 0,
      remainingBudget: 0,
      byCategory: {
        accommodation: 0,
        transportation: 0,
        activities: 0,
        food: 0,
        other: 0,
      },
      byStop: [],
    };

    // Group data by stop
    const stopMap = {};
    stopsResult.rows.forEach((row) => {
      if (!stopMap[row.stop_id]) {
        stopMap[row.stop_id] = {
          stopId: row.stop_id,
          arrivalDate: row.arrival_date,
          departureDate: row.departure_date,
          totalCost: row.estimated_cost || 0,
          activities: [],
        };
      }
      if (row.activity_id) {
        stopMap[row.stop_id].activities.push({
          id: row.activity_id,
          name: row.activity_name,
          type: row.activity_type,
          cost: row.activity_cost || 0,
          currency: row.activity_currency,
        });
      }
    });

    // Calculate budget breakdown
    Object.values(stopMap).forEach((stop) => {
      const stopCost = parseFloat(stop.totalCost) || 0;
      budgetBreakdown.totalEstimatedCost += stopCost;

      let activityCosts = 0;
      stop.activities.forEach((activity) => {
        if (activity.cost) {
          activityCosts += parseFloat(activity.cost);
          switch (activity.type) {
            case "sightseeing":
            case "adventure":
            case "entertainment":
              budgetBreakdown.byCategory.activities += parseFloat(
                activity.cost
              );
              break;
            case "food":
              budgetBreakdown.byCategory.food += parseFloat(activity.cost);
              break;
            case "transport":
              budgetBreakdown.byCategory.transportation += parseFloat(
                activity.cost
              );
              break;
            default:
              budgetBreakdown.byCategory.other += parseFloat(activity.cost);
          }
        }
      });

      budgetBreakdown.byCategory.accommodation += stopCost - activityCosts;

      budgetBreakdown.byStop.push({
        stopId: stop.stopId,
        arrivalDate: stop.arrivalDate,
        departureDate: stop.departureDate,
        totalCost: stopCost,
        accommodationCost: stopCost - activityCosts,
        activityCost: activityCosts,
      });
    });

    budgetBreakdown.remainingBudget =
      budgetBreakdown.totalBudget - budgetBreakdown.totalEstimatedCost;

    res.json({
      success: true,
      data: {
        trip: {
          id: trip.id,
          name: trip.name,
          budget: trip.budget,
        },
        budgetBreakdown,
      },
    });
  } catch (error) {
    console.error("Get trip budget breakdown error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
        message: "Budget must be a positive number",
      });
    }

    // Update budget if trip exists
    const updateResult = await pool.query(
      `UPDATE trips
       SET budget = $1
       WHERE id = $2 AND user_id = $3 AND is_active = true
       RETURNING budget`,
      [budget, tripId, userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      message: "Trip budget updated successfully",
      data: { budget: updateResult.rows[0].budget },
    });
  } catch (error) {
    console.error("Update trip budget error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getTripBudgetBreakdown,
  updateTripBudget,
};
