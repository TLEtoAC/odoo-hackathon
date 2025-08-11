const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cities',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('sightseeing', 'food', 'adventure', 'culture', 'shopping', 'entertainment', 'relaxation', 'transport', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
    validate: {
      min: 0
    }
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    validate: {
      len: [3, 3]
    }
  },
  costType: {
    type: DataTypes.ENUM('per_person', 'per_group', 'fixed', 'free'),
    defaultValue: 'per_person'
  },
  location: {
    type: DataTypes.STRING(200),
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
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'challenging', 'expert'),
    defaultValue: 'easy'
  },
  ageRestriction: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  bestTime: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tips: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'activities',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['cost']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['cityId']
    }
  ]
});

// Instance method to get coordinates
Activity.prototype.getCoordinates = function() {
  if (this.latitude && this.longitude) {
    return {
      lat: parseFloat(this.latitude),
      lng: parseFloat(this.longitude)
    };
  }
  return null;
};

// Instance method to get duration in hours
Activity.prototype.getDurationHours = function() {
  if (this.duration) {
    return (this.duration / 60).toFixed(1);
  }
  return null;
};

// Instance method to get cost per person
Activity.prototype.getCostPerPerson = function() {
  if (this.cost) {
    switch (this.costType) {
      case 'per_person':
        return parseFloat(this.cost);
      case 'per_group':
        return parseFloat(this.cost) / 2; // Assuming average group size of 2
      case 'fixed':
        return parseFloat(this.cost);
      case 'free':
        return 0;
      default:
        return parseFloat(this.cost);
    }
  }
  return 0;
};

// Instance method to get activity summary
Activity.prototype.getSummary = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    type: this.type,
    category: this.category,
    duration: this.duration,
    durationHours: this.getDurationHours(),
    cost: this.cost,
    costPerPerson: this.getCostPerPerson(),
    currency: this.currency,
    costType: this.costType,
    location: this.location,
    coordinates: this.getCoordinates(),
    images: this.images,
    tags: this.tags,
    difficulty: this.difficulty,
    rating: this.rating,
    reviewCount: this.reviewCount
  };
};

module.exports = Activity;
