const { Client } = require('pg');
require('dotenv').config();

const setupDatabase = async () => {
  // Connect to postgres database to create our database
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'globetrotter_db';
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

setupDatabase();