const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // configure as needed
});

async function initUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE CHECK (username ~ '^[a-zA-Z0-9_]+$'),
      email VARCHAR(100) NOT NULL UNIQUE CHECK (position('@' in email) > 1),
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      profile_picture VARCHAR(255),
      bio TEXT,
      preferences JSON,
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS set_updated_at_on_users ON users;
    CREATE TRIGGER set_updated_at_on_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

// Create a new user (with password hashing)
async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const result = await pool.query(
    `
      INSERT INTO users (username, email, password, first_name, last_name, profile_picture, bio, preferences, is_active, last_login)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true), $10)
      RETURNING *;
    `,
    [
      data.username,
      data.email,
      hashedPassword,
      data.firstName,
      data.lastName,
      data.profilePicture || null,
      data.bio || null,
      data.preferences || {},
      data.isActive,
      data.lastLogin || null,
    ]
  );
  return getPublicProfile(result.rows[0]);
}

// Compare password
async function comparePassword(candidatePassword, hashedPassword) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

// Get public profile (omit password)
function getPublicProfile(user) {
  if (!user) return null;
  const { password, ...publicData } = user;
  return publicData;
}

module.exports = {
  pool,
  initUsersTable,
  createUser,
  comparePassword,
  getPublicProfile,
};
