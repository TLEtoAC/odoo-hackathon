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

    // Build WHERE clause
    const conditions = ['"isActive" = true'];
    const params = [];
    let paramIndex = 1;

    if (q) {
      conditions.push(`(
        name ILIKE $${paramIndex} OR 
        country ILIKE $${paramIndex} OR 
        region ILIKE $${paramIndex}
      )`);
      params.push(`%${q}%`);
      paramIndex++;
    }

    if (country) {
      conditions.push(`"countryCode" = $${paramIndex}`);
      params.push(country);
      paramIndex++;
    }

    if (region) {
      conditions.push(`region = $${paramIndex}`);
      params.push(region);
      paramIndex++;
    }

    // Sorting
    const allowedSort = [
      "popularity",
      "name",
      "costIndex",
      "region",
      "country",
    ];
    if (!allowedSort.includes(sortBy)) sortBy = "popularity";
    sortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let orderClause = `ORDER BY "${sortBy}" ${sortOrder}`;
    if (sortBy === "name") {
      orderClause += `, country ASC`;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // Count total
    const countQuery = `SELECT COUNT(*) AS total FROM "Cities" ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalItems = parseInt(countResult.rows[0].total);

    // Fetch rows
    const cityQuery = `
      SELECT 
        id, name, country, "countryCode", region,
        latitude, longitude, "costIndex", popularity,
        description, highlights, images, currency
      FROM "Cities"
      ${whereClause}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `;
    const citiesResult = await pool.query(cityQuery, params);
    const cities = citiesResult.rows; // Replace city.getSummary() logic manually if needed

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
      SELECT * FROM "Cities"
      WHERE id = $1 AND "isActive" = true
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
      FROM "Activities"
      WHERE "cityId" = $1 AND "isActive" = true
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

    const conditions = ['"isActive" = true'];
    const params = [];
    let idx = 1;

    if (country) {
      conditions.push(`"countryCode" = $${idx}`);
      params.push(country);
      idx++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const query = `
      SELECT id, name, country, "countryCode", region,
             "costIndex", popularity, images, currency
      FROM "Cities"
      ${whereClause}
      ORDER BY popularity DESC
      LIMIT ${limit}
    `;
    const result = await pool.query(query, params);

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
      FROM "Cities"
      WHERE "countryCode" = $1 AND "isActive" = true
    `;
    const countResult = await pool.query(countQuery, [
      countryCode.toUpperCase(),
    ]);
    const totalItems = parseInt(countResult.rows[0].total);

    const citiesQuery = `
      SELECT id, name, country, "countryCode", region,
             "costIndex", popularity, images, currency
      FROM "Cities"
      WHERE "countryCode" = $1 AND "isActive" = true
      ORDER BY name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const citiesResult = await pool.query(citiesQuery, [
      countryCode.toUpperCase(),
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
      SELECT "countryCode" AS code,
             country AS name,
             COUNT(id) AS "cityCount"
      FROM "Cities"
      WHERE "isActive" = true
      GROUP BY "countryCode", country
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
