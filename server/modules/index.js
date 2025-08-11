const User = require('./User');
const Trip = require('./Trip');
const City = require('./City');
const Activity = require('./Activity');
const TripStop = require('./TripStop');
const TripActivity = require('./TripActivity');

// User - Trip relationship (One-to-Many)
User.hasMany(Trip, {
  foreignKey: 'userId',
  as: 'trips',
  onDelete: 'CASCADE'
});
Trip.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// City - Activity relationship (One-to-Many)
City.hasMany(Activity, {
  foreignKey: 'cityId',
  as: 'activities',
  onDelete: 'CASCADE'
});
Activity.belongsTo(City, {
  foreignKey: 'cityId',
  as: 'city'
});

// Trip - TripStop relationship (One-to-Many)
Trip.hasMany(TripStop, {
  foreignKey: 'tripId',
  as: 'stops',
  onDelete: 'CASCADE'
});
TripStop.belongsTo(Trip, {
  foreignKey: 'tripId',
  as: 'trip'
});

// City - TripStop relationship (One-to-Many)
City.hasMany(TripStop, {
  foreignKey: 'cityId',
  as: 'tripStops',
  onDelete: 'CASCADE'
});
TripStop.belongsTo(City, {
  foreignKey: 'cityId',
  as: 'city'
});

// TripStop - TripActivity relationship (One-to-Many)
TripStop.hasMany(TripActivity, {
  foreignKey: 'tripStopId',
  as: 'activities',
  onDelete: 'CASCADE'
});
TripActivity.belongsTo(TripStop, {
  foreignKey: 'tripStopId',
  as: 'tripStop'
});

// Activity - TripActivity relationship (One-to-Many)
Activity.hasMany(TripActivity, {
  foreignKey: 'activityId',
  as: 'tripActivities',
  onDelete: 'CASCADE'
});
TripActivity.belongsTo(Activity, {
  foreignKey: 'activityId',
  as: 'activity'
});

// Export all models
module.exports = {
  User,
  Trip,
  City,
  Activity,
  TripStop,
  TripActivity
};
