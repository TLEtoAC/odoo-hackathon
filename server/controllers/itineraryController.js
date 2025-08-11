const { Trip, TripStop, TripActivity, City, Activity } = require('../modules');
const { validationResult } = require('express-validator');
const moment = require('moment');

// Get trip itinerary
const getTripItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Get itinerary with stops and activities
    const itinerary = await TripStop.findAll({
      where: { tripId },
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country', 'countryCode', 'region', 'images']
        },
        {
          model: TripActivity,
          as: 'activities',
          include: [
            {
              model: Activity,
              as: 'activity',
              attributes: ['id', 'name', 'description', 'type', 'duration', 'cost', 'currency', 'images']
            }
          ],
          order: [['startTime', 'ASC']]
        }
      ],
      order: [['arrivalDate', 'ASC'], ['departureDate', 'ASC']]
    });

    // Group by date
    const itineraryByDate = {};
    itinerary.forEach(stop => {
      const arrivalDate = moment(stop.arrivalDate).format('YYYY-MM-DD');
      const departureDate = moment(stop.departureDate).format('YYYY-MM-DD');
      
      // Add to arrival date
      if (!itineraryByDate[arrivalDate]) {
        itineraryByDate[arrivalDate] = [];
      }
      itineraryByDate[arrivalDate].push({
        type: 'arrival',
        stop: {
          id: stop.id,
          city: stop.city,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          estimatedCost: stop.estimatedCost,
          notes: stop.notes,
          activities: stop.activities?.map(ta => ({
            id: ta.id,
            startTime: ta.startTime,
            endTime: ta.endTime,
            notes: ta.notes,
            activity: ta.activity
          })) || []
        }
      });

      // Add to departure date if different
      if (departureDate !== arrivalDate) {
        if (!itineraryByDate[departureDate]) {
          itineraryByDate[departureDate] = [];
        }
        itineraryByDate[departureDate].push({
          type: 'departure',
          stop: {
            id: stop.id,
            city: stop.city,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            estimatedCost: stop.estimatedCost,
            notes: stop.notes,
            activities: stop.activities?.map(ta => ({
              id: ta.id,
              startTime: ta.startTime,
              endTime: ta.endTime,
              notes: ta.notes,
              activity: ta.activity
            })) || []
          }
        });
      }
    });

    // Convert to array and sort
    const sortedItinerary = Object.entries(itineraryByDate)
      .map(([date, stops]) => ({
        date,
        stops: stops.sort((a, b) => {
          if (a.type === 'arrival' && b.type === 'departure') return -1;
          if (a.type === 'departure' && b.type === 'arrival') return 1;
          return moment(a.stop.arrivalDate).diff(moment(b.stop.arrivalDate));
        })
      }))
      .sort((a, b) => moment(a.date).diff(moment(b.date)));

    res.json({
      success: true,
      data: {
        trip: {
          id: trip.id,
          name: trip.name,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: trip.budget,
          status: trip.status
        },
        itinerary: sortedItinerary
      }
    });
  } catch (error) {
    console.error('Get trip itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add stop to itinerary
const addStopToItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      cityId,
      arrivalDate,
      departureDate,
      estimatedCost,
      notes
    } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Verify city exists
    const city = await City.findByPk(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Check for date conflicts
    const existingStops = await TripStop.findAll({
      where: { tripId }
    });

    const hasConflict = existingStops.some(stop => {
      const stopArrival = moment(stop.arrivalDate);
      const stopDeparture = moment(stop.departureDate);
      const newArrival = moment(arrivalDate);
      const newDeparture = moment(departureDate);

      return (
        (newArrival.isBetween(stopArrival, stopDeparture, null, '[]')) ||
        (newDeparture.isBetween(stopArrival, stopDeparture, null, '[]')) ||
        (stopArrival.isBetween(newArrival, newDeparture, null, '[]'))
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Date conflict with existing stops'
      });
    }

    // Create trip stop
    const tripStop = await TripStop.create({
      tripId,
      cityId,
      arrivalDate,
      departureDate,
      estimatedCost,
      notes
    });

    // Get the created stop with city info
    const createdStop = await TripStop.findByPk(tripStop.id, {
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country', 'countryCode', 'region', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Stop added to itinerary successfully',
      data: {
        stop: {
          id: createdStop.id,
          city: createdStop.city,
          arrivalDate: createdStop.arrivalDate,
          departureDate: createdStop.departureDate,
          estimatedCost: createdStop.estimatedCost,
          notes: createdStop.notes,
          activities: []
        }
      }
    });
  } catch (error) {
    console.error('Add stop to itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update itinerary stop
const updateItineraryStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      arrivalDate,
      departureDate,
      estimatedCost,
      notes
    } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Find and update the stop
    const tripStop = await TripStop.findOne({
      where: { id: stopId, tripId }
    });

    if (!tripStop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found'
      });
    }

    // Check for date conflicts with other stops
    const existingStops = await TripStop.findAll({
      where: { 
        tripId,
        id: { [require('sequelize').Op.ne]: stopId }
      }
    });

    const hasConflict = existingStops.some(stop => {
      const stopArrival = moment(stop.arrivalDate);
      const stopDeparture = moment(stop.departureDate);
      const newArrival = moment(arrivalDate);
      const newDeparture = moment(departureDate);

      return (
        (newArrival.isBetween(stopArrival, stopDeparture, null, '[]')) ||
        (newDeparture.isBetween(stopArrival, stopDeparture, null, '[]')) ||
        (stopArrival.isBetween(newArrival, newDeparture, null, '[]'))
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Date conflict with existing stops'
      });
    }

    await tripStop.update({
      arrivalDate,
      departureDate,
      estimatedCost,
      notes
    });

    res.json({
      success: true,
      message: 'Stop updated successfully'
    });
  } catch (error) {
    console.error('Update itinerary stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Remove stop from itinerary
const removeStopFromItinerary = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Find and delete the stop
    const tripStop = await TripStop.findOne({
      where: { id: stopId, tripId }
    });

    if (!tripStop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found'
      });
    }

    await tripStop.destroy();

    res.json({
      success: true,
      message: 'Stop removed from itinerary successfully'
    });
  } catch (error) {
    console.error('Remove stop from itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add activity to stop
const addActivityToStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      activityId,
      startTime,
      endTime,
      notes
    } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Verify stop exists
    const tripStop = await TripStop.findOne({
      where: { id: stopId, tripId }
    });

    if (!tripStop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found'
      });
    }

    // Verify activity exists
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check for time conflicts
    const existingActivities = await TripActivity.findAll({
      where: { tripStopId: stopId }
    });

    const hasConflict = existingActivities.some(existing => {
      const existingStart = moment(existing.startTime);
      const existingEnd = moment(existing.endTime);
      const newStart = moment(startTime);
      const newEnd = moment(endTime);

      return (
        (newStart.isBetween(existingStart, existingEnd, null, '[]')) ||
        (newEnd.isBetween(existingStart, existingEnd, null, '[]')) ||
        (existingStart.isBetween(newStart, newEnd, null, '[]'))
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict with existing activities'
      });
    }

    // Create trip activity
    const tripActivity = await TripActivity.create({
      tripStopId: stopId,
      activityId,
      startTime,
      endTime,
      notes
    });

    // Get the created activity with full details
    const createdActivity = await TripActivity.findByPk(tripActivity.id, {
      include: [
        {
          model: Activity,
          as: 'activity',
          attributes: ['id', 'name', 'description', 'type', 'duration', 'cost', 'currency', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Activity added to stop successfully',
      data: {
        activity: {
          id: createdActivity.id,
          startTime: createdActivity.startTime,
          endTime: createdActivity.endTime,
          notes: createdActivity.notes,
          activity: createdActivity.activity
        }
      }
    });
  } catch (error) {
    console.error('Add activity to stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update trip activity
const updateTripActivity = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      startTime,
      endTime,
      notes
    } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Find and update the activity
    const tripActivity = await TripActivity.findOne({
      where: { id: activityId, tripStopId: stopId },
      include: [
        {
          model: TripStop,
          as: 'tripStop',
          where: { tripId }
        }
      ]
    });

    if (!tripActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check for time conflicts with other activities
    const existingActivities = await TripActivity.findAll({
      where: { 
        tripStopId: stopId,
        id: { [require('sequelize').Op.ne]: activityId }
      }
    });

    const hasConflict = existingActivities.some(existing => {
      const existingStart = moment(existing.startTime);
      const existingEnd = moment(existing.endTime);
      const newStart = moment(startTime);
      const newEnd = moment(endTime);

      return (
        (newStart.isBetween(existingStart, existingEnd, null, '[]')) ||
        (newEnd.isBetween(existingStart, existingEnd, null, '[]')) ||
        (existingStart.isBetween(newStart, newEnd, null, '[]'))
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict with existing activities'
      });
    }

    await tripActivity.update({
      startTime,
      endTime,
      notes
    });

    res.json({
      success: true,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Update trip activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Remove activity from stop
const removeActivityFromStop = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Find and delete the activity
    const tripActivity = await TripActivity.findOne({
      where: { id: activityId, tripStopId: stopId },
      include: [
        {
          model: TripStop,
          as: 'tripStop',
          where: { tripId }
        }
      ]
    });

    if (!tripActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await tripActivity.destroy();

    res.json({
      success: true,
      message: 'Activity removed from stop successfully'
    });
  } catch (error) {
    console.error('Remove activity from stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reorder stops in itinerary
const reorderItineraryStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(stopIds)) {
      return res.status(400).json({
        success: false,
        message: 'stopIds must be an array'
      });
    }

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId, isActive: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Update order of stops
    for (let i = 0; i < stopIds.length; i++) {
      await TripStop.update(
        { order: i + 1 },
        { where: { id: stopIds[i], tripId } }
      );
    }

    res.json({
      success: true,
      message: 'Itinerary stops reordered successfully'
    });
  } catch (error) {
    console.error('Reorder itinerary stops error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getTripItinerary,
  addStopToItinerary,
  updateItineraryStop,
  removeStopFromItinerary,
  addActivityToStop,
  updateTripActivity,
  removeActivityFromStop,
  reorderItineraryStops
};
