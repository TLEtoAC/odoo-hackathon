const { sequelize } = require('./db');
const { User, Trip, City, Activity, TripStop, TripActivity } = require('./modules');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample cities
    const cities = await City.bulkCreate([
      {
        name: 'Paris',
        country: 'France',
        countryCode: 'FR',
        region: 'Île-de-France',
        latitude: 48.8566,
        longitude: 2.3522,
        costIndex: 85,
        popularity: 95,
        description: 'The City of Light',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
        images: [],
        currency: 'EUR'
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        region: 'Kanto',
        latitude: 35.6762,
        longitude: 139.6503,
        costIndex: 90,
        popularity: 90,
        description: 'Modern metropolis meets tradition',
        highlights: ['Tokyo Tower', 'Shibuya Crossing', 'Senso-ji Temple'],
        images: [],
        currency: 'JPY'
      },
      {
        name: 'New York',
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        costIndex: 95,
        popularity: 88,
        description: 'The Big Apple',
        highlights: ['Statue of Liberty', 'Central Park', 'Times Square'],
        images: [],
        currency: 'USD'
      }
    ]);

    // Create sample activities
    await Activity.bulkCreate([
      {
        cityId: cities[0].id,
        name: 'Eiffel Tower Visit',
        description: 'Visit the iconic Eiffel Tower',
        type: 'sightseeing',
        category: 'landmarks',
        duration: 120,
        cost: 25.00,
        currency: 'EUR',
        costType: 'per_person',
        location: 'Champ de Mars',
        latitude: 48.8584,
        longitude: 2.2945,
        difficulty: 'easy',
        rating: 4.5,
        reviewCount: 1250
      },
      {
        cityId: cities[0].id,
        name: 'Louvre Museum',
        description: 'World famous art museum',
        type: 'culture',
        category: 'museum',
        duration: 180,
        cost: 17.00,
        currency: 'EUR',
        costType: 'per_person',
        location: 'Rue de Rivoli',
        latitude: 48.8606,
        longitude: 2.3376,
        difficulty: 'easy',
        rating: 4.7,
        reviewCount: 2100
      },
      {
        cityId: cities[1].id,
        name: 'Tokyo Tower',
        description: 'Iconic red tower with city views',
        type: 'sightseeing',
        category: 'landmarks',
        duration: 90,
        cost: 1200,
        currency: 'JPY',
        costType: 'per_person',
        location: 'Minato City',
        latitude: 35.6586,
        longitude: 139.7454,
        difficulty: 'easy',
        rating: 4.3,
        reviewCount: 890
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${cities.length} cities and activities`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// Run seeding if called directly
if (require.main === module) {
  sequelize.sync({ force: true }).then(() => {
    seedData().then(() => {
      process.exit(0);
    });
  });
}

module.exports = { seedData };