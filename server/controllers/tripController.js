const { Trip, TripStop, City, TripActivity, Activity, User } = require('../modules');
const { validationResult } = require('express-validator');

// Create new trip
const createTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, startDate, endDate, budget, currency, tags } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const trip = await Trip.create({
      name,
      description,
      startDate,
      endDate,
      budget,
      currency,
      tags,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: {
        trip: trip.getSummary()
      }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's trips
const getUserTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) whereClause.status = status;
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: trips } = await Trip.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'country', 'countryCode']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedTrips = trips.map(trip => {
      const tripData = trip.getSummary();
      tripData.stopCount = trip.stops?.length || 0;
      tripData.destinations = trip.stops?.map(stop => stop.city?.name).filter(Boolean) || [];
      return tripData;
    });

    res.json({
      success: true,
      data: {
        trips: formattedTrips,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get trip by ID
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'country', 'countryCode', 'description', 'images']
            },
            {
              model: TripActivity,
              as: 'activities',
              include: [
                {
                  model: Activity,
                  as: 'activity',
                  attributes: ['id', 'name', 'description', 'type', 'duration', 'cost', 'images']
                }
              ]
            }
          ],
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const tripData = trip.getSummary();
    tripData.stops = trip.stops?.map(stop => ({
      ...stop.getSummary(),
      city: stop.city?.getSummary(),
      activities: stop.activities?.map(ta => ({
        ...ta.getSummary(),
        activity: ta.activity?.getSummary()
      })) || []
    })) || [];

    res.json({
      success: true,
      data: {
        trip: tripData
      }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { tripId } = req.params;
    const { name, description, startDate, endDate, budget, currency, tags, isPublic } = req.body;

    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (budget !== undefined) updateData.budget = budget;
    if (currency !== undefined) updateData.currency = currency;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await trip.update(updateData);

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: {
        trip: trip.getSummary()
      }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.user.id }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    await trip.destroy();

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get public trips
const getPublicTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, country } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { isPublic: true };
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: trips } = await Trip.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: TripStop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city',
              where: country ? { countryCode: country } : {},
              attributes: ['id', 'name', 'country', 'countryCode']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedTrips = trips.map(trip => {
      const tripData = trip.getSummary();
      tripData.user = trip.user?.getPublicProfile();
      tripData.stopCount = trip.stops?.length || 0;
      tripData.destinations = trip.stops?.map(stop => stop.city?.name).filter(Boolean) || [];
      return tripData;
    });

    res.json({
      success: true,
      data: {
        trips: formattedTrips,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get public trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getPublicTrips
};
