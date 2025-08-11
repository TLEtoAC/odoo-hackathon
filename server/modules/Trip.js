const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  coverPhoto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  budget: {
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
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed', 'cancelled'),
    defaultValue: 'planning'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      allowComments: true,
      allowSharing: true,
      notifications: true
    }
  }
}, {
  tableName: 'trips',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['startDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isPublic']
    }
  ]
});

// Instance method to calculate trip duration
Trip.prototype.getDuration = function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Instance method to check if trip is active
Trip.prototype.isActive = function() {
  const today = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  return today >= start && today <= end;
};

// Instance method to get trip summary
Trip.prototype.getSummary = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    startDate: this.startDate,
    endDate: this.endDate,
    duration: this.getDuration(),
    status: this.status,
    budget: this.budget,
    currency: this.currency,
    isPublic: this.isPublic
  };
};

module.exports = Trip;
