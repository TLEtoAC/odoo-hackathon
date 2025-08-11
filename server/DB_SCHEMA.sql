-- GlobeTrotter PostgreSQL schema (create via PGAdmin)
-- Ensure you run this on the target database before starting the server.

-- Drop existing tables in dependency order (optional for dev)
-- DROP TABLE IF EXISTS trip_activities CASCADE;
-- DROP TABLE IF EXISTS trip_stops CASCADE;
-- DROP TABLE IF EXISTS activities CASCADE;
-- DROP TABLE IF EXISTS trips CASCADE;
-- DROP TABLE IF EXISTS cities CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  profile_picture VARCHAR(255),
  bio TEXT,
  preferences JSONB DEFAULT '{"language":"en","currency":"USD","timezone":"UTC","notifications":true}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(3) NOT NULL,
  region VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  timezone VARCHAR(50),
  population INTEGER,
  cost_index DECIMAL(5,2),
  popularity INTEGER DEFAULT 0,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  climate JSONB DEFAULT '{}'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  currency VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);
CREATE INDEX IF NOT EXISTS idx_cities_country_code ON cities(country_code);
CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities(popularity);
CREATE INDEX IF NOT EXISTS idx_cities_cost_index ON cities(cost_index);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_photo VARCHAR(255),
  budget DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'planning', -- planning | active | completed | cancelled
  is_public BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{"allowComments":true,"allowSharing":true,"notifications":true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON trips(is_public);

-- Activities (master catalog)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  category VARCHAR(50),
  duration INTEGER, -- minutes
  cost DECIMAL(10,2),
  currency VARCHAR(10),
  cost_type VARCHAR(50),
  location VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  difficulty VARCHAR(50),
  rating DECIMAL(3,2),
  review_count INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- Trip stops (itinerary stops per trip)
CREATE TABLE IF NOT EXISTS trip_stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
  arrival_date DATE,
  departure_date DATE,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON trip_stops(city_id);

-- Trip activities (scheduled activities within a stop)
CREATE TABLE IF NOT EXISTS trip_activities (
  id SERIAL PRIMARY KEY,
  trip_stop_id INTEGER NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_activity_id ON trip_activities(activity_id);

-- Triggers to auto-update timestamps (optional)
CREATE OR REPLACE FUNCTION set_timestamp() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_users'
  ) THEN
    CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_cities'
  ) THEN
    CREATE TRIGGER set_timestamp_cities BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_trips'
  ) THEN
    CREATE TRIGGER set_timestamp_trips BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_trip_stops'
  ) THEN
    CREATE TRIGGER set_timestamp_trip_stops BEFORE UPDATE ON trip_stops FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_trip_activities'
  ) THEN
    CREATE TRIGGER set_timestamp_trip_activities BEFORE UPDATE ON trip_activities FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
END $$;
