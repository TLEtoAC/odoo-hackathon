const { sequelize } = require("../db");

async function initTripTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        cover_photo VARCHAR(255),
        budget DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'planning',
        is_public BOOLEAN DEFAULT FALSE,
        tags JSON DEFAULT '[]',
        settings JSON DEFAULT '{"allowComments": true, "allowSharing": true, "notifications": true}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips (user_id);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips (start_date);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_trips_status ON trips (status);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_trips_is_public ON trips (is_public);`
  );
}

// Helper functions (replacing Sequelize instance methods)
function getDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isActive(startDate, endDate) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return today >= start && today <= end;
}

function getSummary(trip) {
  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.start_date,
    endDate: trip.end_date,
    duration: getDuration(trip.start_date, trip.end_date),
    status: trip.status,
    budget: trip.budget,
    currency: trip.currency,
    isPublic: trip.is_public,
  };
}

module.exports = {
  initTripTable,
  getDuration,
  isActive,
  getSummary,
};
