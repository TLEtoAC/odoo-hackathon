const { Trip, City, User } = require('../modules');
const { Op } = require('sequelize');
const moment = require('moment');

// Get dashboard data
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = moment().startOf('day');

    // Get upcoming trips (next 30 days)
    const upcomingTrips = await Trip.findAll({
      where: {
        userId,
        startDate: {
          [Op.gte]: currentDate.toDate()
        },
        endDate: {
          [Op.lte]: moment().add(30, 'days').endOf('day').toDate()
        },
        isActive: true
      },
      include: [
        {
          model: City,
          as: 'stops',
          through: { attributes: [] },
          attributes: ['id', 'name', 'country', 'countryCode']
        }
      ],
      order: [['startDate', 'ASC']],
      limit: 5
    });

    // Get recent trips (last 30 days)
    const recentTrips = await Trip.findAll({
      where: {
        userId,
        endDate: {
          [Op.lte]: currentDate.toDate(),
          [Op.gte]: moment().subtract(30, 'days').startOf('day').toDate()
        },
        isActive: true
      },
      include: [
        {
          model: City,
          as: 'stops',
          through: { attributes: [] },
          attributes: ['id', 'name', 'country', 'countryCode']
        }
      ],
      order: [['endDate', 'DESC']],
      limit: 5
    });

    // Get popular cities
    const popularCities = await City.findAll({
      where: { isActive: true },
      order: [['popularity', 'DESC']],
      limit: 6,
      attributes: ['id', 'name', 'country', 'countryCode', 'costIndex', 'popularity', 'images']
    });

    // Get budget highlights
    const budgetData = await Trip.findAll({
      where: {
        userId,
        isActive: true
      },
      attributes: [
        'id',
        'name',
        'budget',
        'startDate',
        'endDate'
      ]
    });

    // Calculate budget statistics
    const totalBudget = budgetData.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const upcomingBudget = upcomingTrips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const averageBudgetPerTrip = budgetData.length > 0 ? totalBudget / budgetData.length : 0;

    // Get user stats
    const totalTrips = await Trip.count({
      where: { userId, isActive: true }
    });

    const totalCities = await Trip.count({
      where: { userId, isActive: true },
      include: [
        {
          model: City,
          as: 'stops',
          through: { attributes: [] }
        }
      ],
      distinct: true
    });

    // Format trips for response
    const formatTrip = (trip) => ({
      id: trip.id,
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      status: trip.status,
      cities: trip.stops?.map(stop => ({
        id: stop.id,
        name: stop.name,
        country: stop.country,
        countryCode: stop.countryCode
      })) || []
    });

    res.json({
      success: true,
      data: {
        upcomingTrips: upcomingTrips.map(formatTrip),
        recentTrips: recentTrips.map(formatTrip),
        popularCities: popularCities.map(city => ({
          id: city.id,
          name: city.name,
          country: city.country,
          countryCode: city.countryCode,
          costIndex: city.costIndex,
          popularity: city.popularity,
          image: city.images?.[0] || null
        })),
        budgetHighlights: {
          totalBudget,
          upcomingBudget,
          averageBudgetPerTrip: Math.round(averageBudgetPerTrip * 100) / 100,
          totalTrips,
          totalCities
        },
        quickActions: [
          { name: 'Plan New Trip', action: 'create-trip', icon: 'plus' },
          { name: 'Explore Cities', action: 'explore-cities', icon: 'search' },
          { name: 'View All Trips', action: 'view-trips', icon: 'list' },
          { name: 'Budget Overview', action: 'budget-overview', icon: 'chart' }
        ]
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get trip statistics
const getTripStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'year' } = req.query;

    let startDate;
    switch (period) {
      case 'month':
        startDate = moment().startOf('month');
        break;
      case 'quarter':
        startDate = moment().startOf('quarter');
        break;
      case 'year':
      default:
        startDate = moment().startOf('year');
        break;
    }

    const trips = await Trip.findAll({
      where: {
        userId,
        startDate: {
          [Op.gte]: startDate.toDate()
        },
        isActive: true
      },
      attributes: [
        'id',
        'name',
        'startDate',
        'endDate',
        'budget',
        'status'
      ]
    });

    // Calculate statistics
    const totalTrips = trips.length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    const plannedTrips = trips.filter(trip => trip.status === 'planned').length;
    const ongoingTrips = trips.filter(trip => trip.status === 'ongoing').length;

    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const averageBudget = totalTrips > 0 ? totalBudget / totalTrips : 0;

    // Calculate total trip duration
    const totalDays = trips.reduce((sum, trip) => {
      if (trip.startDate && trip.endDate) {
        const duration = moment(trip.endDate).diff(moment(trip.startDate), 'days') + 1;
        return sum + duration;
      }
      return sum;
    }, 0);

    // Monthly breakdown
    const monthlyData = {};
    trips.forEach(trip => {
      if (trip.startDate) {
        const month = moment(trip.startDate).format('YYYY-MM');
        if (!monthlyData[month]) {
          monthlyData[month] = { trips: 0, budget: 0 };
        }
        monthlyData[month].trips += 1;
        monthlyData[month].budget += trip.budget || 0;
      }
    });

    const monthlyBreakdown = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      trips: data.trips,
      budget: data.budget
    }));

    res.json({
      success: true,
      data: {
        period,
        overview: {
          totalTrips,
          completedTrips,
          plannedTrips,
          ongoingTrips,
          totalBudget,
          averageBudget: Math.round(averageBudget * 100) / 100,
          totalDays
        },
        monthlyBreakdown,
        completionRate: totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get budget overview
const getBudgetOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'year' } = req.query;

    let startDate;
    switch (period) {
      case 'month':
        startDate = moment().startOf('month');
        break;
      case 'quarter':
        startDate = moment().startOf('quarter');
        break;
      case 'year':
      default:
        startDate = moment().startOf('year');
        break;
    }

    const trips = await Trip.findAll({
      where: {
        userId,
        startDate: {
          [Op.gte]: startDate.toDate()
        },
        isActive: true
      },
      include: [
        {
          model: City,
          as: 'stops',
          through: { attributes: ['estimatedCost'] },
          attributes: ['id', 'name', 'country']
        }
      ]
    });

    // Calculate budget breakdown
    const budgetBreakdown = {
      totalBudget: 0,
      allocatedBudget: 0,
      remainingBudget: 0,
      byCategory: {
        accommodation: 0,
        transportation: 0,
        activities: 0,
        food: 0,
        other: 0
      },
      byTrip: []
    };

    trips.forEach(trip => {
      const tripBudget = trip.budget || 0;
      budgetBreakdown.totalBudget += tripBudget;

      // Calculate estimated costs from trip stops
      const estimatedCosts = trip.stops?.reduce((sum, stop) => {
        return sum + (stop.TripStop?.estimatedCost || 0);
      }, 0) || 0;

      budgetBreakdown.allocatedBudget += estimatedCosts;
      budgetBreakdown.remainingBudget += Math.max(0, tripBudget - estimatedCosts);

      budgetBreakdown.byTrip.push({
        tripId: trip.id,
        tripName: trip.name,
        budget: tripBudget,
        estimatedCost: estimatedCosts,
        remaining: Math.max(0, tripBudget - estimatedCosts)
      });
    });

    // Calculate percentages
    const totalBudget = budgetBreakdown.totalBudget;
    if (totalBudget > 0) {
      budgetBreakdown.allocatedPercentage = Math.round((budgetBreakdown.allocatedBudget / totalBudget) * 100);
      budgetBreakdown.remainingPercentage = Math.round((budgetBreakdown.remainingBudget / totalBudget) * 100);
    } else {
      budgetBreakdown.allocatedPercentage = 0;
      budgetBreakdown.remainingPercentage = 0;
    }

    res.json({
      success: true,
      data: {
        period,
        budgetBreakdown,
        summary: {
          totalTrips: trips.length,
          averageBudgetPerTrip: totalBudget > 0 ? Math.round((totalBudget / trips.length) * 100) / 100 : 0,
          budgetUtilization: budgetBreakdown.allocatedPercentage
        }
      }
    });
  } catch (error) {
    console.error('Get budget overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardData,
  getTripStats,
  getBudgetOverview
};
