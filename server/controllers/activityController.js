const { Activity, City } = require('../modules');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Search activities
const searchActivities = async (req, res) => {
  try {
    const { 
      q = '', 
      type, 
      category, 
      cityId,
      minCost = 0,
      maxCost,
      minDuration = 0,
      maxDuration,
      difficulty,
      page = 1, 
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Search query
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { category: { [Op.like]: `%${q}%` } }
      ];
    }

    // Filter by type
    if (type) {
      whereClause.type = type;
    }

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Filter by city
    if (cityId) {
      whereClause.cityId = cityId;
    }

    // Filter by cost range
    if (maxCost) {
      whereClause.cost = {
        [Op.between]: [parseFloat(minCost), parseFloat(maxCost)]
      };
    } else if (minCost > 0) {
      whereClause.cost = {
        [Op.gte]: parseFloat(minCost)
      };
    }

    // Filter by duration range
    if (maxDuration) {
      whereClause.duration = {
        [Op.between]: [parseInt(minDuration), parseInt(maxDuration)]
      };
    } else if (minDuration > 0) {
      whereClause.duration = {
        [Op.gte]: parseInt(minDuration)
      };
    }

    // Filter by difficulty
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    // Sorting
    const orderClause = [[sortBy, sortOrder.toUpperCase()]];
    if (sortBy === 'name') {
      orderClause.push(['rating', 'DESC']);
    }

    const { count, rows: activities } = await Activity.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country', 'countryCode']
        }
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedActivities = activities.map(activity => activity.getSummary());

    res.json({
      success: true,
      data: {
        activities: formattedActivities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get activity by ID
const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findOne({
      where: { id: activityId, isActive: true },
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country', 'countryCode', 'region']
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    const activityData = activity.getSummary();
    activityData.city = activity.city;

    res.json({
      success: true,
      data: {
        activity: activityData
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get activities by type
const getActivitiesByType = async (req, res) => {
  try {
    const { type, cityId, limit = 10 } = req.query;

    const whereClause = { 
      isActive: true,
      type: type 
    };

    if (cityId) {
      whereClause.cityId = cityId;
    }

    const activities = await Activity.findAll({
      where: whereClause,
      order: [['rating', 'DESC']],
      limit: parseInt(limit),
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country']
        }
      ]
    });

    const formattedActivities = activities.map(activity => activity.getSummary());

    res.json({
      success: true,
      data: {
        activities: formattedActivities
      }
    });
  } catch (error) {
    console.error('Get activities by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get activity types
const getActivityTypes = async (req, res) => {
  try {
    const types = [
      'sightseeing',
      'food',
      'adventure',
      'culture',
      'shopping',
      'entertainment',
      'relaxation',
      'transport',
      'other'
    ];

    res.json({
      success: true,
      data: {
        types
      }
    });
  } catch (error) {
    console.error('Get activity types error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get popular activities
const getPopularActivities = async (req, res) => {
  try {
    const { cityId, limit = 10 } = req.query;

    const whereClause = { isActive: true };
    if (cityId) {
      whereClause.cityId = cityId;
    }

    const activities = await Activity.findAll({
      where: whereClause,
      order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
      limit: parseInt(limit),
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country']
        }
      ]
    });

    const formattedActivities = activities.map(activity => activity.getSummary());

    res.json({
      success: true,
      data: {
        activities: formattedActivities
      }
    });
  } catch (error) {
    console.error('Get popular activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new activity (Admin only)
const createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      type,
      category,
      duration,
      cost,
      currency,
      costType,
      location,
      latitude,
      longitude,
      difficulty,
      ageRestriction,
      tips,
      cityId
    } = req.body;

    const activity = await Activity.create({
      name,
      description,
      type,
      category,
      duration,
      cost,
      currency,
      costType,
      location,
      latitude,
      longitude,
      difficulty,
      ageRestriction,
      tips,
      cityId
    });

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: {
        activity: activity.getSummary()
      }
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update activity (Admin only)
const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await activity.update(req.body);

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: {
        activity: activity.getSummary()
      }
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete activity (Admin only)
const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await activity.update({ isActive: false });

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  searchActivities,
  getActivityById,
  getActivitiesByType,
  getActivityTypes,
  getPopularActivities,
  createActivity,
  updateActivity,
  deleteActivity
};
