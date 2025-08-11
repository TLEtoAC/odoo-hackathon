const pool = require('./dbPool');

// Test database connection
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

// Just connect to existing database
const syncDatabase = async () => {
  try {
    console.log('✅ Using existing database tables.');
  } catch (error) {
    console.error('❌ Error with database:', error);
    throw error;
  }
};

module.exports = { testConnection, syncDatabase };
