const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../dbPool');
const bcrypt = require('bcryptjs');

// Local Strategy for email/password authentication
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const r = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
      if (r.rowCount === 0) return done(null, false, { message: 'Invalid credentials' });
      const user = r.rows[0];
      if (user.is_active === false) return done(null, false, { message: 'Account is deactivated' });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return done(null, false, { message: 'Invalid credentials' });

      // Update last login
      await pool.query('UPDATE users SET last_login=NOW() WHERE id=$1', [user.id]);

      const publicUser = { id: user.id, email: user.email, username: user.username, firstName: user.first_name, lastName: user.last_name };
      return done(null, publicUser);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user for the session
passport.serializeUser((user, done) => { done(null, user.id); });

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const r = await pool.query('SELECT id, email, username, first_name AS "firstName", last_name AS "lastName", is_active AS "isActive" FROM users WHERE id=$1', [id]);
    if (r.rowCount === 0) return done(null, false);
    done(null, r.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
