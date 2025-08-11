const pool = require('../dbPool');
const { validationResult } = require('express-validator');

// Get trip itinerary
const getTripItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id, name FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Get trip stops with activities
    const stops = await pool.query(`
      SELECT ts.id, ts.order, ts.arrival_date AS "arrivalDate", ts.departure_date AS "departureDate", 
             ts.estimated_cost AS "estimatedCost", ts.notes,
             c.id AS "cityId", c.name AS "cityName", c.country, c.country_code AS "countryCode"
      FROM trip_stops ts
      LEFT JOIN cities c ON c.id = ts.city_id
      WHERE ts.trip_id = $1
      ORDER BY ts.order ASC
    `, [tripId]);

    res.json({
      success: true,
      data: {
        trip: trip.rows[0],
        stops: stops.rows
      }
    });
  } catch (error) {
    console.error('Get trip itinerary error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add stop to itinerary
const addStopToItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityId, arrivalDate, departureDate, estimatedCost, notes } = req.body;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Get next order number
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX("order"), 0) + 1 AS next_order FROM trip_stops WHERE trip_id=$1',
      [tripId]
    );
    const nextOrder = orderResult.rows[0].next_order;

    // Insert new stop
    const result = await pool.query(`
      INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, estimated_cost, notes, "order")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, "order", arrival_date AS "arrivalDate", departure_date AS "departureDate", 
                estimated_cost AS "estimatedCost", notes
    `, [tripId, cityId, arrivalDate, departureDate, estimatedCost || 0, notes, nextOrder]);

    res.status(201).json({
      success: true,
      message: 'Stop added to itinerary successfully',
      data: { stop: result.rows[0] }
    });
  } catch (error) {
    console.error('Add stop to itinerary error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update itinerary stop
const updateItineraryStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { arrivalDate, departureDate, estimatedCost, notes } = req.body;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await pool.query(`
      UPDATE trip_stops 
      SET arrival_date=$1, departure_date=$2, estimated_cost=$3, notes=$4, updated_at=NOW()
      WHERE id=$5 AND trip_id=$6
    `, [arrivalDate, departureDate, estimatedCost, notes, stopId, tripId]);

    res.json({ success: true, message: 'Stop updated successfully' });
  } catch (error) {
    console.error('Update itinerary stop error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Remove stop from itinerary
const removeStopFromItinerary = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await pool.query('DELETE FROM trip_stops WHERE id=$1 AND trip_id=$2', [stopId, tripId]);

    res.json({ success: true, message: 'Stop removed from itinerary successfully' });
  } catch (error) {
    console.error('Remove stop from itinerary error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add activity to stop
const addActivityToStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { activityId, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const result = await pool.query(`
      INSERT INTO trip_activities (trip_stop_id, activity_id, start_time, end_time, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, start_time AS "startTime", end_time AS "endTime", notes
    `, [stopId, activityId, startTime, endTime, notes]);

    res.status(201).json({
      success: true,
      message: 'Activity added to stop successfully',
      data: { activity: result.rows[0] }
    });
  } catch (error) {
    console.error('Add activity to stop error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update trip activity
const updateTripActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const { startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await pool.query(`
      UPDATE trip_activities 
      SET start_time=$1, end_time=$2, notes=$3, updated_at=NOW()
      WHERE id=$4 AND trip_stop_id=$5
    `, [startTime, endTime, notes, activityId, stopId]);

    res.json({ success: true, message: 'Activity updated successfully' });
  } catch (error) {
    console.error('Update trip activity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Remove activity from stop
const removeActivityFromStop = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await pool.query('DELETE FROM trip_activities WHERE id=$1 AND trip_stop_id=$2', [activityId, stopId]);

    res.json({ success: true, message: 'Activity removed from stop successfully' });
  } catch (error) {
    console.error('Remove activity from stop error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reorder stops in itinerary
const reorderItineraryStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await pool.query(
      'SELECT id FROM trips WHERE id=$1 AND user_id=$2',
      [tripId, userId]
    );
    
    if (trip.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Update order for each stop
    for (let i = 0; i < stopIds.length; i++) {
      await pool.query(
        'UPDATE trip_stops SET "order"=$1 WHERE id=$2 AND trip_id=$3',
        [i + 1, stopIds[i], tripId]
      );
    }

    res.json({ success: true, message: 'Stops reordered successfully' });
  } catch (error) {
    console.error('Reorder itinerary stops error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getTripItinerary,
  addStopToItinerary,
  updateItineraryStop,
  removeStopFromItinerary,
  addActivityToStop,
  updateTripActivity,
  removeActivityFromStop,
  reorderItineraryStops
};