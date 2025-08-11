const { City, Activity } = require('../modules');
const { Op } = require('sequelize');

// Search cities
const searchCities = async (req, res) => {
  try {
    const { 
      q = '', 
      country, 
      region, 
      page = 1, 
      limit = 20,
      sortBy = 'popularity',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Search query
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { country: { [Op.like]: `%${q}%` } },
        { region: { [Op.like]: `%${q}%` } }
      ];
    }

    // Filter by country
    if (country) {
      whereClause.countryCode = country;
    }

    // Filter by region
    if (region) {
      whereClause.region = region;
    }

    // Sorting
    const orderClause = [[sortBy, sortOrder.toUpperCase()]];
    if (sortBy === 'name') {
      orderClause.push(['country', 'ASC']);
    }

    const { count, rows: cities } = await City.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 'name', 'country', 'countryCode', 'region', 
        'latitude', 'longitude', 'costIndex', 'popularity',
        'description', 'highlights', 'images', 'currency'
      ]
    });

    const formattedCities = cities.map(city => city.getSummary());

    res.json({
      success: true,
      data: {
        cities: formattedCities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get city by ID
const getCityById = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findOne({
      where: { id: cityId, isActive: true },
      include: [
        {
          model: Activity,
          as: 'activities',
          where: { isActive: true },
          required: false,
          attributes: [
            'id', 'name', 'description', 'type', 'category',
            'duration', 'cost', 'currency', 'rating', 'images'
          ]
        }
      ]
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    const cityData = city.getSummary();
    cityData.activities = city.activities?.map(activity => activity.getSummary()) || [];

    res.json({
      success: true,
      data: {
        city: cityData
      }
    });
  } catch (error) {
    console.error('Get city error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get popular cities
const getPopularCities = async (req, res) => {
  try {
    const { limit = 10, country } = req.query;

    const whereClause = { isActive: true };
    if (country) {
      whereClause.countryCode = country;
    }

    const cities = await City.findAll({
      where: whereClause,
      order: [['popularity', 'DESC']],
      limit: parseInt(limit),
      attributes: [
        'id', 'name', 'country', 'countryCode', 'region',
        'costIndex', 'popularity', 'images', 'currency'
      ]
    });

    const formattedCities = cities.map(city => city.getSummary());

    res.json({
      success: true,
      data: {
        cities: formattedCities
      }
    });
  } catch (error) {
    console.error('Get popular cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get cities by country
const getCitiesByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: cities } = await City.findAndCountAll({
      where: { 
        countryCode: countryCode.toUpperCase(),
        isActive: true 
      },
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 'name', 'country', 'countryCode', 'region',
        'costIndex', 'popularity', 'images', 'currency'
      ]
    });

    const formattedCities = cities.map(city => city.getSummary());

    res.json({
      success: true,
      data: {
        cities: formattedCities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get cities by country error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get countries list
const getCountries = async (req, res) => {
  try {
    const countries = await City.findAll({
      attributes: [
        'countryCode',
        'country',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cityCount']
      ],
      where: { isActive: true },
      group: ['countryCode', 'country'],
      order: [['country', 'ASC']]
    });

    const formattedCountries = countries.map(country => ({
      code: country.countryCode,
      name: country.country,
      cityCount: parseInt(country.dataValues.cityCount)
    }));

    res.json({
      success: true,
      data: {
        countries: formattedCountries
      }
    });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  searchCities,
  getCityById,
  getPopularCities,
  getCitiesByCountry,
  getCountries
};
