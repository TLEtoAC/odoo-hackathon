const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  countryCode: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      len: [2, 3]
    }
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  costIndex: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  popularity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  highlights: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  climate: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  languages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: true,
    defaultValue: 'USD'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cities',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['country']
    },
    {
      fields: ['countryCode']
    },
    {
      fields: ['popularity']
    },
    {
      fields: ['costIndex']
    }
  ]
});

// Instance method to get full location string
City.prototype.getFullLocation = function() {
  if (this.region) {
    return `${this.name}, ${this.region}, ${this.country}`;
  }
  return `${this.name}, ${this.country}`;
};

// Instance method to get coordinates
City.prototype.getCoordinates = function() {
  if (this.latitude && this.longitude) {
    return {
      lat: parseFloat(this.latitude),
      lng: parseFloat(this.longitude)
    };
  }
  return null;
};

// Instance method to get city summary
City.prototype.getSummary = function() {
  return {
    id: this.id,
    name: this.name,
    country: this.country,
    countryCode: this.countryCode,
    region: this.region,
    coordinates: this.getCoordinates(),
    costIndex: this.costIndex,
    popularity: this.popularity,
    description: this.description,
    highlights: this.highlights,
    images: this.images
  };
};

module.exports = City;
