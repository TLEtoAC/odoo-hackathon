const pool = require('../dbPool');
const moment = require('moment');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = moment().startOf("day").toDate();
    const end180Days = moment().add(180, "days").endOf("day").toDate();
    const start90DaysAgo = moment()
      .subtract(90, "days")
      .startOf("day")
      .toDate();

    // Upcoming trips
    const upcomingTripsRes = await pool.query(
      `
      SELECT t.*, json_agg(json_build_object(
        'id', c.id,
        'name', c.name,
        'country', c.country,
        'countryCode', c.country_code
      )) AS stops
      FROM trips t
      LEFT JOIN trip_stops ts ON t.id = ts.trip_id
      LEFT JOIN cities c ON ts.city_id = c.id
      WHERE t.user_id = $1
        AND t.start_date <= $2
        AND t.end_date >= $3
        AND t.is_active = true
      GROUP BY t.id
      ORDER BY t.start_date ASC
      LIMIT 8
      `,
      [userId, end180Days, currentDate]
    );
    const upcomingTrips = upcomingTripsRes.rows;

    // Recent trips
    const recentTripsRes = await pool.query(
      `
      SELECT t.*, json_agg(json_build_object(
        'id', c.id,
        'name', c.name,
        'country', c.country,
        'countryCode', c.country_code
      )) AS stops
      FROM trips t
      LEFT JOIN trip_stops ts ON t.id = ts.trip_id
      LEFT JOIN cities c ON ts.city_id = c.id
      WHERE t.user_id = $1
        AND t.end_date <= $2
        AND t.end_date >= $3
        AND t.is_active = true
      GROUP BY t.id
      ORDER BY t.end_date DESC
      LIMIT 5
      `,
      [userId, currentDate, start90DaysAgo]
    );
    const recentTrips = recentTripsRes.rows;

    // Popular cities
    const popularCitiesRes = await pool.query(
      `
      SELECT id, name, country, country_code, cost_index, popularity, images
      FROM cities
      WHERE is_active = true
      ORDER BY popularity DESC
      LIMIT 6
      `
    );
    const popularCities = popularCitiesRes.rows;

    // Budget highlights
    const budgetDataRes = await pool.query(
      `
      SELECT id, name, budget, start_date, end_date
      FROM trips
      WHERE user_id = $1
        AND is_active = true
      `,
      [userId]
    );
    const budgetData = budgetDataRes.rows;

    const totalBudget = budgetData.reduce((sum, t) => sum + (t.budget || 0), 0);
    const upcomingBudget = upcomingTrips.reduce(
      (sum, t) => sum + (t.budget || 0),
      0
    );
    const averageBudgetPerTrip =
      budgetData.length > 0 ? totalBudget / budgetData.length : 0;

    // User stats
    const totalTripsRes = await pool.query(
      `SELECT COUNT(*) FROM trips WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    const totalTrips = parseInt(totalTripsRes.rows[0].count, 10);

    const totalCitiesRes = await pool.query(
      `
      SELECT COUNT(DISTINCT ts.city_id) AS count
      FROM trips t
      JOIN trip_stops ts ON t.id = ts.trip_id
      WHERE t.user_id = $1 AND t.is_active = true
      `,
      [userId]
    );
    const totalCities = parseInt(totalCitiesRes.rows[0].count, 10);

    const formatTrip = (trip) => ({
      id: trip.id,
      name: trip.name,
      startDate: trip.start_date,
      endDate: trip.end_date,
      budget: trip.budget,
      status: trip.status,
      cities: trip.stops?.filter((s) => s.id !== null) || [],
    });

    res.json({
      success: true,
      data: {
        upcomingTrips: upcomingTrips.map(formatTrip),
        recentTrips: recentTrips.map(formatTrip),
        popularCities: popularCities.map((c) => ({
          id: c.id,
          name: c.name,
          country: c.country,
          countryCode: c.country_code,
          costIndex: c.cost_index,
          popularity: c.popularity,
          image: c.images?.[0] || null,
        })),
        budgetHighlights: {
          totalBudget,
          upcomingBudget,
          averageBudgetPerTrip: Math.round(averageBudgetPerTrip * 100) / 100,
          totalTrips,
          totalCities,
        },
        quickActions: [
          { name: "Plan New Trip", action: "create-trip", icon: "plus" },
          { name: "Explore Cities", action: "explore-cities", icon: "search" },
          { name: "View All Trips", action: "view-trips", icon: "list" },
          { name: "Budget Overview", action: "budget-overview", icon: "chart" },
        ],
      },
    });
  } catch (err) {
    console.error("Get dashboard data error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTripStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    res.json({
      success: true,
      data: {
        totalTrips: 0,
        completedTrips: 0,
        upcomingTrips: 0,
        monthlyBreakdown: []
      }
    });
  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getBudgetOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    res.json({
      success: true,
      data: {
        totalBudget: 0,
        spentBudget: 0,
        remainingBudget: 0,
        budgetBreakdown: []
      }
    });
  } catch (error) {
    console.error('Get budget overview error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getDashboardData, getTripStats, getBudgetOverview };
