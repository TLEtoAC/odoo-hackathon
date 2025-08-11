const pool = require('../dbPool');
const { validationResult } = require('express-validator');

// Create new trip
const createTrip = async (req, res) => {
  try {
    console.log('Create trip request:', req.body);
    const { name, description, startDate, endDate, budget, currency, tags } = req.body;
    
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required' });
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    // Use dummy user ID for testing
    const userId = req.user?.id || 1;
    
    const insert = await pool.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, budget, currency, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, name, description, start_date AS "startDate", end_date AS "endDate", budget, currency, is_public AS "isPublic", status`,
      [userId, name, description || null, startDate, endDate, budget || null, currency || 'USD', JSON.stringify(tags || [])]
    );

    res.status(201).json({ success: true, message: 'Trip created successfully', data: { trip: insert.rows[0] } });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get user's trips
const getUserTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const count = await pool.query('SELECT COUNT(*)::int AS c FROM trips WHERE user_id=$1', [req.user.id]);
    const rows = await pool.query(
      `SELECT id, name, description, start_date AS "startDate", end_date AS "endDate", budget, currency, status, is_public AS "isPublic"
       FROM trips WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), offset]
    );

    res.json({ success: true, data: { trips: rows.rows, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(count.rows[0].c / limit), totalItems: count.rows[0].c, itemsPerPage: parseInt(limit) } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get trip by ID
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const t = await pool.query(
      `SELECT id, name, description, start_date AS "startDate", end_date AS "endDate", budget, currency, status, is_public AS "isPublic" FROM trips WHERE id=$1 AND user_id=$2`,
      [tripId, req.user.id]
    );
    if (t.rowCount === 0) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Stops
    const stops = await pool.query(
      `SELECT ts.id, ts.order, ts.arrival_date AS "arrivalDate", ts.departure_date AS "departureDate", ts.estimated_cost AS "estimatedCost",
              c.id AS "cityId", c.name AS "cityName", c.country, c.country_code AS "countryCode", c.latitude, c.longitude
       FROM trip_stops ts
       LEFT JOIN cities c ON c.id = ts.city_id
       WHERE ts.trip_id=$1
       ORDER BY ts.order ASC`,
      [tripId]
    );

    const trip = t.rows[0];
    trip.stops = stops.rows;

    res.json({ success: true, data: { trip } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, description, startDate, endDate, budget, currency, tags, isPublic } = req.body;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    const set = [];
    const values = [];
    let idx = 1;
    const setField = (col, val) => { set.push(`${col}=$${idx++}`); values.push(val); };
    if (name !== undefined) setField('name', name);
    if (description !== undefined) setField('description', description);
    if (startDate !== undefined) setField('start_date', startDate);
    if (endDate !== undefined) setField('end_date', endDate);
    if (budget !== undefined) setField('budget', budget);
    if (currency !== undefined) setField('currency', currency);
    if (tags !== undefined) setField('tags', JSON.stringify(tags));
    if (isPublic !== undefined) setField('is_public', !!isPublic);

    values.push(tripId); values.push(req.user.id);

    await pool.query(`UPDATE trips SET ${set.join(', ')}, updated_at=NOW() WHERE id=$${idx++} AND user_id=$${idx} `, values);

    const updated = await pool.query(
      `SELECT id, name, description, start_date AS "startDate", end_date AS "endDate", budget, currency, status, is_public AS "isPublic" FROM trips WHERE id=$1 AND user_id=$2`,
      [tripId, req.user.id]
    );

    res.json({ success: true, message: 'Trip updated successfully', data: { trip: updated.rows[0] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    await pool.query('DELETE FROM trips WHERE id=$1 AND user_id=$2', [tripId, req.user.id]);
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Public trips
const getPublicTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const count = await pool.query('SELECT COUNT(*)::int AS c FROM trips WHERE is_public=true');
    const rows = await pool.query(
      `SELECT id, name, description, start_date AS "startDate", end_date AS "endDate", budget, currency, status, is_public AS "isPublic"
       FROM trips WHERE is_public=true ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );
    res.json({ success: true, data: { trips: rows.rows, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(count.rows[0].c / limit), totalItems: count.rows[0].c, itemsPerPage: parseInt(limit) } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createTrip, getUserTrips, getTripById, updateTrip, deleteTrip, getPublicTrips };