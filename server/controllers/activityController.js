const pool = require('../dbPool');
const { validationResult } = require("express-validator");

// Helper: format activity
const getSummary = (activity) => ({
  id: activity.id,
  name: activity.name,
  description: activity.description,
  type: activity.type,
  category: activity.category,
  duration: activity.duration,
  cost: activity.cost,
  currency: activity.currency,
  costType: activity.cost_type,
  location: activity.location,
  latitude: activity.latitude,
  longitude: activity.longitude,
  difficulty: activity.difficulty,
  ageRestriction: activity.age_restriction,
  tips: activity.tips,
  rating: activity.rating,
  reviewCount: activity.review_count,
  cityId: activity.city_id,
});

// Search activities
const searchActivities = async (req, res) => {
  try {
    const {
      q = "",
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
      sortBy = "rating",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const values = [];
    let whereClauses = ["a.is_active = true"];

    if (q) {
      values.push(`%${q}%`);
      values.push(`%${q}%`);
      values.push(`%${q}%`);
      whereClauses.push(
        `(a.name ILIKE $${values.length - 2} OR a.description ILIKE $${
          values.length - 1
        } OR a.category ILIKE $${values.length})`
      );
    }

    if (type) {
      values.push(type);
      whereClauses.push(`a.type = $${values.length}`);
    }

    if (category) {
      values.push(category);
      whereClauses.push(`a.category = $${values.length}`);
    }

    if (cityId) {
      values.push(cityId);
      whereClauses.push(`a.city_id = $${values.length}`);
    }

    if (maxCost) {
      values.push(parseFloat(minCost));
      values.push(parseFloat(maxCost));
      whereClauses.push(
        `a.cost BETWEEN $${values.length - 1} AND $${values.length}`
      );
    } else if (minCost > 0) {
      values.push(parseFloat(minCost));
      whereClauses.push(`a.cost >= $${values.length}`);
    }

    if (maxDuration) {
      values.push(parseInt(minDuration));
      values.push(parseInt(maxDuration));
      whereClauses.push(
        `a.duration BETWEEN $${values.length - 1} AND $${values.length}`
      );
    } else if (minDuration > 0) {
      values.push(parseInt(minDuration));
      whereClauses.push(`a.duration >= $${values.length}`);
    }

    if (difficulty) {
      values.push(difficulty);
      whereClauses.push(`a.difficulty = $${values.length}`);
    }

    const orderCol = [
      "name",
      "rating",
      "cost",
      "duration",
      "review_count",
    ].includes(sortBy)
      ? sortBy
      : "rating";
    const orderDir = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Count query
    const countQuery = `
      SELECT COUNT(*) 
      FROM activities a
      WHERE ${whereClauses.join(" AND ")}
    `;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count);

    // Main query
    const dataQuery = `
      SELECT a.*, c.id as city_id, c.name as city_name, c.country, c.country_code
      FROM activities a
      JOIN cities c ON a.city_id = c.id
      WHERE ${whereClauses.join(" AND ")}
      ORDER BY ${orderCol} ${orderDir}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const dataValues = [...values, parseInt(limit), parseInt(offset)];
    const activitiesResult = await pool.query(dataQuery, dataValues);

    const formattedActivities = activitiesResult.rows.map(getSummary);

    res.json({
      success: true,
      data: {
        activities: formattedActivities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Search activities error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get activity by ID
const getActivityById = async (req, res) => {
  try {
    const { activityId } = req.params;
    const query = `
      SELECT a.*, c.id as city_id, c.name as city_name, c.country, c.country_code, c.region
      FROM activities a
      JOIN cities c ON a.city_id = c.id
      WHERE a.id = $1 AND a.is_active = true
    `;
    const result = await pool.query(query, [activityId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    const activityData = getSummary(result.rows[0]);
    activityData.city = {
      id: result.rows[0].city_id,
      name: result.rows[0].city_name,
      country: result.rows[0].country,
      countryCode: result.rows[0].country_code,
      region: result.rows[0].region,
    };

    res.json({ success: true, data: { activity: activityData } });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get activities by type
const getActivitiesByType = async (req, res) => {
  try {
    const { type, cityId, limit = 10 } = req.query;
    const values = [type];
    let where = `a.is_active = true AND a.type = $1`;

    if (cityId) {
      values.push(cityId);
      where += ` AND a.city_id = $${values.length}`;
    }

    const query = `
      SELECT a.*, c.id as city_id, c.name as city_name, c.country
      FROM activities a
      JOIN cities c ON a.city_id = c.id
      WHERE ${where}
      ORDER BY a.rating DESC
      LIMIT $${values.length + 1}
    `;
    values.push(parseInt(limit));

    const result = await pool.query(query, values);
    const formattedActivities = result.rows.map(getSummary);

    res.json({ success: true, data: { activities: formattedActivities } });
  } catch (error) {
    console.error("Get activities by type error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get activity types
const getActivityTypes = (req, res) => {
  try {
    const types = [
      "sightseeing",
      "food",
      "adventure",
      "culture",
      "shopping",
      "entertainment",
      "relaxation",
      "transport",
      "other",
    ];
    res.json({ success: true, data: { types } });
  } catch (error) {
    console.error("Get activity types error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get popular activities
const getPopularActivities = async (req, res) => {
  try {
    const { cityId, limit = 10 } = req.query;
    const values = [];
    let where = `a.is_active = true`;

    if (cityId) {
      values.push(cityId);
      where += ` AND a.city_id = $${values.length}`;
    }

    const query = `
      SELECT a.*, c.id as city_id, c.name as city_name, c.country
      FROM activities a
      JOIN cities c ON a.city_id = c.id
      WHERE ${where}
      ORDER BY a.rating DESC, a.review_count DESC
      LIMIT $${values.length + 1}
    `;
    values.push(parseInt(limit));

    const result = await pool.query(query, values);
    const formattedActivities = result.rows.map(getSummary);

    res.json({ success: true, data: { activities: formattedActivities } });
  } catch (error) {
    console.error("Get popular activities error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create activity
const createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
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
      cityId,
    } = req.body;

    const query = `
      INSERT INTO activities
      (name, description, type, category, duration, cost, currency, cost_type, location, latitude, longitude,
       difficulty, age_restriction, tips, city_id, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true)
      RETURNING *
    `;
    const values = [
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
      cityId,
    ];

    const result = await pool.query(query, values);
    res
      .status(201)
      .json({
        success: true,
        message: "Activity created successfully",
        data: { activity: getSummary(result.rows[0]) },
      });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update activity
const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
    }

    const fields = Object.keys(req.body);
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`);
    const values = Object.values(req.body);
    values.push(activityId);

    const query = `
      UPDATE activities
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: { activity: getSummary(result.rows[0]) },
    });
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete activity (soft delete)
const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const query = `
      UPDATE activities
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [activityId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    res.json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
  deleteActivity,
};
