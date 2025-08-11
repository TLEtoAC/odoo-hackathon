const pool = require('../dbPool');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// User registration
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check duplicates
    const dup = await pool.query('SELECT 1 FROM users WHERE email=$1 OR username=$2 LIMIT 1', [email, username]);
    if (dup.rowCount > 0) {
      return res.status(400).json({ success: false, message: 'Email or username already exists' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const insert = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1,$2,$3,$4,$5) RETURNING id, username, email, first_name AS "firstName", last_name AS "lastName", is_active AS "isActive"`,
      [username, email, hashed, firstName, lastName]
    );

    const user = insert.rows[0];

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.error('Session creation error:', err);
        return res.status(500).json({ success: false, message: 'Session creation failed' });
      }
      res.status(201).json({ success: true, message: 'User registered successfully', data: { user } });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Login via Passport local already handles compare; but keep API fallback
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const found = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
    if (found.rowCount === 0) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const user = found.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const publicUser = { id: user.id, username: user.username, email: user.email, firstName: user.first_name, lastName: user.last_name, isActive: user.is_active };

    await new Promise((resolve, reject) => { req.login(publicUser, (err) => (err ? reject(err) : resolve())); });

    res.json({ success: true, message: 'Login successful', data: { user: publicUser } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const r = await pool.query('SELECT id, username, email, first_name AS "firstName", last_name AS "lastName", is_active AS "isActive" FROM users WHERE id=$1', [req.user.id]);
    res.json({ success: true, data: { user: r.rows[0] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const r = await pool.query('UPDATE users SET first_name=$1, last_name=$2, bio=$3, updated_at=NOW() WHERE id=$4 RETURNING id, username, email, first_name AS "firstName", last_name AS "lastName", is_active AS "isActive"', [firstName, lastName, bio || null, req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully', data: { user: r.rows[0] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const found = await pool.query('SELECT id,password FROM users WHERE id=$1', [req.user.id]);
    const ok = await bcrypt.compare(currentPassword, found.rows[0].password);
    if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try { req.logout(() => res.json({ success: true, message: 'Logout successful' })); } catch { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const found = await pool.query('SELECT password FROM users WHERE id=$1', [req.user.id]);
    const ok = await bcrypt.compare(password, found.rows[0].password);
    if (!ok) return res.status(400).json({ success: false, message: 'Password is incorrect' });
    await pool.query('UPDATE users SET is_active=false, updated_at=NOW() WHERE id=$1', [req.user.id]);
    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { register, login, logout, getProfile, updateProfile, changePassword, deleteAccount };