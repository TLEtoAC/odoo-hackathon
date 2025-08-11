const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const TripActivity = sequelize.define('TripActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripStopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trip_stops',
      key: 'id'
    }
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id'
    }
  },
  tripStopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trip_stops',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'booked', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  bookingReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'must_do'),
    defaultValue: 'medium'
  },
  customFields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'trip_activities',
  indexes: [
    {
      fields: ['tripStopId']
    },
    {
      fields: ['activityId']
    },
    {
      fields: ['scheduledDate']
    },
    {
      fields: ['status']
    }
  ]
});

// Instance method to get time range string
TripActivity.prototype.getTimeRange = function() {
  if (this.startTime && this.endTime) {
    return `${this.startTime} - ${this.endTime}`;
  } else if (this.startTime) {
    return `From ${this.startTime}`;
  } else if (this.endTime) {
    return `Until ${this.endTime}`;
  }
  return 'Time not specified';
};

// Instance method to get duration in hours
TripActivity.prototype.getDurationHours = function() {
  if (this.duration) {
    return (this.duration / 60).toFixed(1);
  }
  return null;
};

// Instance method to check if activity is today
TripActivity.prototype.isToday = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.scheduledDate === today;
};

// Instance method to get activity summary
TripActivity.prototype.getSummary = function() {
  return {
    id: this.id,
    scheduledDate: this.scheduledDate,
    startTime: this.startTime,
    endTime: this.endTime,
    timeRange: this.getTimeRange(),
    duration: this.duration,
    durationHours: this.getDurationHours(),
    cost: this.cost,
    currency: this.currency,
    notes: this.notes,
    status: this.status,
    bookingReference: this.bookingReference,
    priority: this.priority,
    customFields: this.customFields
  };
};

module.exports = TripActivity;
