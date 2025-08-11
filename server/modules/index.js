const { sequelize } = require("../db");

async function initRelationships() {
  await sequelize.query(`
    ALTER TABLE trips
    ADD CONSTRAINT IF NOT EXISTS fk_trips_user
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

    ALTER TABLE activities
    ADD CONSTRAINT IF NOT EXISTS fk_activities_city
    FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE;

    ALTER TABLE trip_stops
    ADD CONSTRAINT IF NOT EXISTS fk_trip_stops_trip
    FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE;

    ALTER TABLE trip_stops
    ADD CONSTRAINT IF NOT EXISTS fk_trip_stops_city
    FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE;

    ALTER TABLE trip_activities
    ADD CONSTRAINT IF NOT EXISTS fk_trip_activities_trip_stop
    FOREIGN KEY (tripStopId) REFERENCES trip_stops(id) ON DELETE CASCADE;

    ALTER TABLE trip_activities
    ADD CONSTRAINT IF NOT EXISTS fk_trip_activities_activity
    FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE;
  `);
}

module.exports = { initRelationships };
