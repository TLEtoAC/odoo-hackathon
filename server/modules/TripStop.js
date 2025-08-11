const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const TripStop = sequelize.define('TripStop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id'
    }
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cities',
      key: 'id'
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  accommodation: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  transport: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  estimatedCost: {
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
    type: DataTypes.ENUM('planned', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  customFields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'trip_stops',
  indexes: [
    {
      fields: ['tripId']
    },
    {
      fields: ['cityId']
    },
    {
      fields: ['order']
    },
    {
      fields: ['arrivalDate']
    }
  ]
});

// Instance method to calculate stop duration
TripStop.prototype.getDuration = function() {
  const arrival = new Date(this.arrivalDate);
  const departure = new Date(this.departureDate);
  const diffTime = Math.abs(departure - arrival);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Instance method to check if stop is active
TripStop.prototype.isActive = function() {
  const today = new Date();
  const arrival = new Date(this.arrivalDate);
  const departure = new Date(this.departureDate);
  return today >= arrival && today <= departure;
};

// Instance method to get stop summary
TripStop.prototype.getSummary = function() {
  return {
    id: this.id,
    order: this.order,
    arrivalDate: this.arrivalDate,
    departureDate: this.departureDate,
    duration: this.getDuration(),
    notes: this.notes,
    accommodation: this.accommodation,
    transport: this.transport,
    estimatedCost: this.estimatedCost,
    currency: this.currency,
    status: this.status,
    customFields: this.customFields
  };
};

module.exports = TripStop;
