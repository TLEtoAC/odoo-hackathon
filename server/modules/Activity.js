// activity.js - Raw SQL version

const pool = require("./db");

// Create table if not exists
async function createActivitiesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      city_id INTEGER NOT NULL REFERENCES cities(id),
      name VARCHAR(200) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL DEFAULT 'other',
      category VARCHAR(100),
      duration INTEGER CHECK (duration >= 0),
      cost NUMERIC(10, 2) CHECK (cost >= 0),
      currency CHAR(3) DEFAULT 'USD' CHECK (char_length(currency) = 3),
      cost_type VARCHAR(20) DEFAULT 'per_person',
      location VARCHAR(200),
      latitude NUMERIC(10, 8) CHECK (latitude >= -90 AND latitude <= 90),
      longitude NUMERIC(11, 8) CHECK (longitude >= -180 AND longitude <= 180),
      images JSON DEFAULT '[]',
      tags JSON DEFAULT '[]',
      difficulty VARCHAR(20) DEFAULT 'easy',
      age_restriction INTEGER CHECK (age_restriction >= 0),
      best_time JSON DEFAULT '{}',
      requirements JSON DEFAULT '[]',
      tips TEXT,
      rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
      review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
      is_active BOOLEAN DEFAULT true
    );
  `;
  await pool.query(query);
}

// Insert new activity
async function insertActivity(activity) {
  const query = `
    INSERT INTO activities (
      city_id, name, description, type, category, duration, cost, currency,
      cost_type, location, latitude, longitude, images, tags, difficulty,
      age_restriction, best_time, requirements, tips, rating, review_count, is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22
    ) RETURNING *;
  `;
  const values = [
    activity.city_id,
    activity.name,
    activity.description,
    activity.type,
    activity.category,
    activity.duration,
    activity.cost,
    activity.currency,
    activity.cost_type,
    activity.location,
    activity.latitude,
    activity.longitude,
    JSON.stringify(activity.images || []),
    JSON.stringify(activity.tags || []),
    activity.difficulty,
    activity.age_restriction,
    JSON.stringify(activity.best_time || {}),
    JSON.stringify(activity.requirements || []),
    activity.tips,
    activity.rating,
    activity.review_count,
    activity.is_active,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Utility methods
function getCoordinates(activity) {
  if (activity.latitude && activity.longitude) {
    return {
      lat: parseFloat(activity.latitude),
      lng: parseFloat(activity.longitude),
    };
  }
  return null;
}

function getDurationHours(activity) {
  return activity.duration ? (activity.duration / 60).toFixed(1) : null;
}

function getCostPerPerson(activity) {
  if (!activity.cost) return 0;
  switch (activity.cost_type) {
    case "per_person":
      return parseFloat(activity.cost);
    case "per_group":
      return parseFloat(activity.cost) / 2;
    case "fixed":
      return parseFloat(activity.cost);
    case "free":
      return 0;
    default:
      return parseFloat(activity.cost);
  }
}

function getSummary(activity) {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    type: activity.type,
    category: activity.category,
    duration: activity.duration,
    durationHours: getDurationHours(activity),
    cost: activity.cost,
    costPerPerson: getCostPerPerson(activity),
    currency: activity.currency,
    costType: activity.cost_type,
    location: activity.location,
    coordinates: getCoordinates(activity),
    images: activity.images,
    tags: activity.tags,
    difficulty: activity.difficulty,
    rating: activity.rating,
    reviewCount: activity.review_count,
  };
}

module.exports = {
  createActivitiesTable,
  insertActivity,
  getSummary,
};
