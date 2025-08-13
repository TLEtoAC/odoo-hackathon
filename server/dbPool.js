const { Pool } = require('pg');

// Hardcoded connection for development; adjust if needed
const DB_HOST = 'localhost';
const DB_PORT = 5432;
const DB_NAME = 'globetrotter';
const DB_USER = 'username';
const DB_PASSWORD = 'password';

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
});

module.exports = pool;
