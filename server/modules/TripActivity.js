const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or configure host/user/password/db
});

async function initTripActivitiesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trip_activities (
        id SERIAL PRIMARY KEY,
        trip_stop_id INTEGER NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
        activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
        scheduled_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        duration INTEGER CHECK (duration >= 0),
        cost DECIMAL(10, 2) CHECK (cost >= 0),
        currency VARCHAR(3) DEFAULT 'USD' CHECK (char_length(currency) = 3),
        notes TEXT,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'completed', 'cancelled')),
        booking_reference VARCHAR(100),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'must_do')),
        custom_fields JSON DEFAULT '{}'
    );
  `);

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_trip_activities_trip_stop_id ON trip_activities (trip_stop_id);`
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_trip_activities_activity_id ON trip_activities (activity_id);`
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_trip_activities_scheduled_date ON trip_activities (scheduled_date);`
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_trip_activities_status ON trip_activities (status);`
  );
}

// Plain JS helper functions (no ORM)
function getTimeRange(activity) {
  if (activity.start_time && activity.end_time) {
    return `${activity.start_time} - ${activity.end_time}`;
  } else if (activity.start_time) {
    return `From ${activity.start_time}`;
  } else if (activity.end_time) {
    return `Until ${activity.end_time}`;
  }
  return "Time not specified";
}

function getDurationHours(activity) {
  if (activity.duration != null) {
    return (activity.duration / 60).toFixed(1);
  }
  return null;
}

function isToday(activity) {
  const today = new Date().toISOString().split("T")[0];
  return activity.scheduled_date === today;
}

function getSummary(activity) {
  return {
    id: activity.id,
    scheduledDate: activity.scheduled_date,
    startTime: activity.start_time,
    endTime: activity.end_time,
    timeRange: getTimeRange(activity),
    duration: activity.duration,
    durationHours: getDurationHours(activity),
    cost: activity.cost,
    currency: activity.currency,
    notes: activity.notes,
    status: activity.status,
    bookingReference: activity.booking_reference,
    priority: activity.priority,
    customFields: activity.custom_fields,
  };
}

module.exports = {
  initTripActivitiesTable,
  getTimeRange,
  getDurationHours,
  isToday,
  getSummary,
  pool, // export so you can reuse DB connection
};
