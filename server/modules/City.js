const { sequelize } = require("../db");

// Create the cities table + indexes
async function initCityTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
        country VARCHAR(100) NOT NULL CHECK (char_length(country) BETWEEN 1 AND 100),
        countryCode VARCHAR(3) NOT NULL CHECK (char_length(countryCode) BETWEEN 2 AND 3),
        region VARCHAR(100),
        latitude DECIMAL(10, 8) CHECK (latitude >= -90 AND latitude <= 90),
        longitude DECIMAL(11, 8) CHECK (longitude >= -180 AND longitude <= 180),
        timezone VARCHAR(50),
        population INTEGER CHECK (population >= 0),
        costIndex DECIMAL(5, 2) CHECK (costIndex >= 0),
        popularity INTEGER DEFAULT 0 CHECK (popularity >= 0 AND popularity <= 100),
        description TEXT,
        highlights JSON DEFAULT '[]',
        images JSON DEFAULT '[]',
        climate JSON DEFAULT '{}',
        languages JSON DEFAULT '[]',
        currency VARCHAR(3) DEFAULT 'USD',
        isActive BOOLEAN DEFAULT TRUE
    );
  `);

  // Indexes
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_cities_name ON cities (name);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_cities_country ON cities (country);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_cities_countryCode ON cities (countryCode);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities (popularity);`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_cities_costIndex ON cities (costIndex);`
  );
}

// ===== Helper functions =====
function getFullLocation(city) {
  if (city.region) {
    return `${city.name}, ${city.region}, ${city.country}`;
  }
  return `${city.name}, ${city.country}`;
}

function getCoordinates(city) {
  if (city.latitude && city.longitude) {
    return {
      lat: parseFloat(city.latitude),
      lng: parseFloat(city.longitude),
    };
  }
  return null;
}

function getSummary(city) {
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    region: city.region,
    coordinates: getCoordinates(city),
    costIndex: city.costIndex,
    popularity: city.popularity,
    description: city.description,
    highlights: city.highlights,
    images: city.images,
  };
}

// ===== Data Access Functions =====
async function getCityById(id) {
  const [results] = await sequelize.query(
    `SELECT * FROM cities WHERE id = $1`,
    {
      bind: [id],
    }
  );
  return results[0] || null;
}

async function insertCity(data) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

  const [result] = await sequelize.query(
    `INSERT INTO cities (${fields.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`,
    { bind: values }
  );

  return result[0];
}

module.exports = {
  initCityTable,
  getFullLocation,
  getCoordinates,
  getSummary,
  getCityById,
  insertCity,
};
