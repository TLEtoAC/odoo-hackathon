const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing GlobeTrotter Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('   Environment:', healthResponse.data.environment);
    console.log('   Timestamp:', healthResponse.data.timestamp);
    console.log('');

    // Test authentication endpoints
    console.log('2. Testing authentication endpoints...');
    
    // Test registration
    console.log('   Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
        email: 'test@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log('   ✅ Registration successful');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('   ℹ️  User already exists (expected)');
      } else {
        console.log('   ❌ Registration failed:', error.response?.data?.message || error.message);
      }
    }

    // Test login
    console.log('   Testing user login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword123'
      });
      console.log('   ✅ Login successful');
      
      // Test protected endpoint
      console.log('   Testing protected endpoint...');
      const cookies = loginResponse.headers['set-cookie'];
      const profileResponse = await axios.get(`${API_BASE}/api/auth/profile`, {
        headers: {
          Cookie: cookies?.join('; ')
        }
      });
      console.log('   ✅ Protected endpoint accessible');
    } catch (error) {
      console.log('   ❌ Login failed:', error.response?.data?.message || error.message);
    }

    console.log('');

    // Test explore endpoints
    console.log('3. Testing explore endpoints...');
    
    // Test cities search
    console.log('   Testing cities search...');
    try {
      const citiesResponse = await axios.get(`${API_BASE}/api/explore/cities/search?q=paris&limit=5`);
      console.log('   ✅ Cities search successful');
      console.log(`   📍 Found ${citiesResponse.data.data.cities.length} cities`);
    } catch (error) {
      console.log('   ❌ Cities search failed:', error.response?.data?.message || error.message);
    }

    // Test activities search
    console.log('   Testing activities search...');
    try {
      const activitiesResponse = await axios.get(`${API_BASE}/api/explore/activities/search?type=sightseeing&limit=5`);
      console.log('   ✅ Activities search successful');
      console.log(`   🎯 Found ${activitiesResponse.data.data.activities.length} activities`);
    } catch (error) {
      console.log('   ❌ Activities search failed:', error.response?.data?.message || error.message);
    }

    console.log('');

    console.log('🎉 Backend testing completed!');
    console.log('📱 Frontend can now connect to these endpoints');
    console.log('🔗 API Base URL:', API_BASE);

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
      console.log('   Run: npm run dev');
    }
  }
}

// Run the test
testBackend();
