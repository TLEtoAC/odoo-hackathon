const pool = require('../dbPool');

// Search cities
const searchCities = async (req, res) => {
  try {
    let {
      q = "",
      country,
      region,
      page = 1,
      limit = 20,
      sortBy = "popularity",
      sortOrder = "DESC",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS total FROM cities WHERE is_active = true`;
    const countResult = await pool.query(countQuery);
    const totalItems = parseInt(countResult.rows[0].total);

    const cityQuery = `
      SELECT 
        id, name, country, country_code, region,
        latitude, longitude, cost_index, popularity,
        description, highlights, images, currency
      FROM cities
      WHERE is_active = true
      ORDER BY popularity DESC
      LIMIT $1 OFFSET $2
    `;
    const citiesResult = await pool.query(cityQuery, [limit, offset]);
    const cities = citiesResult.rows;

    res.json({
      success: true,
      data: {
        cities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Search cities error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get city by ID
const getCityById = async (req, res) => {
  try {
    const { cityId } = req.params;

    const cityQuery = `
      SELECT * FROM cities
      WHERE id = $1 AND is_active = true
    `;
    const cityResult = await pool.query(cityQuery, [cityId]);
    if (cityResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "City not found" });
    }
    const city = cityResult.rows[0];

    const activitiesQuery = `
      SELECT id, name, description, type, category,
             duration, cost, currency, rating, images
      FROM activities
      WHERE city_id = $1 AND is_active = true
    `;
    const activitiesResult = await pool.query(activitiesQuery, [cityId]);

    city.activities = activitiesResult.rows;

    res.json({
      success: true,
      data: { city },
    });
  } catch (error) {
    console.error("Get city error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get popular cities
const getPopularCities = async (req, res) => {
  try {
    let { limit = 10, country } = req.query;
    limit = parseInt(limit);

    const query = `
      SELECT id, name, country, country_code, region,
             cost_index, popularity, images, currency
      FROM cities
      WHERE is_active = true
      ORDER BY popularity DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);

    res.json({ success: true, data: { cities: result.rows } });
  } catch (error) {
    console.error("Get popular cities error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get cities by country
const getCitiesByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params;
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM cities
      WHERE country_code = $1 AND is_active = true
    `;
    const countResult = await pool.query(countQuery, [
      countryCode.toUpperCase(),
    ]);
    const totalItems = parseInt(countResult.rows[0].total);

    const citiesQuery = `
      SELECT id, name, country, country_code, region,
             cost_index, popularity, images, currency
      FROM cities
      WHERE country_code = $1 AND is_active = true
      ORDER BY name ASC
      LIMIT $2 OFFSET $3
    `;
    const citiesResult = await pool.query(citiesQuery, [
      countryCode.toUpperCase(),
      limit,
      offset
    ]);

    res.json({
      success: true,
      data: {
        cities: citiesResult.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Get cities by country error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get countries list
const getCountries = async (req, res) => {
  try {
    const query = `
      SELECT country_code AS code,
             country AS name,
             COUNT(id) AS city_count
      FROM cities
      WHERE is_active = true
      GROUP BY country_code, country
      ORDER BY country ASC
    `;
    const result = await pool.query(query);

    res.json({ success: true, data: { countries: result.rows } });
  } catch (error) {
    console.error("Get countries error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  searchCities,
  getCityById,
  getPopularCities,
  getCitiesByCountry,
  getCountries,
};