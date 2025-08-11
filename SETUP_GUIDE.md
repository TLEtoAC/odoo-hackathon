# 🌍 GlobeTrotter Setup Guide

## 🚀 Quick Start

### 1. Database Setup (PostgreSQL)

First, ensure you have PostgreSQL installed and running. Then create a database:

```sql
CREATE DATABASE globetrotter;
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_NAME=globetrotter
DB_PORT=5432

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_here
SESSION_MAX_AGE=86400000

# Environment
NODE_ENV=development
USE_MOCKS=false

# Third-party API keys (optional but recommended)
OPENWEATHER_API_KEY=your_openweather_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
TOMTOM_API_KEY=your_tomtom_api_key
TRAVELPAYOUTS_TOKEN=your_travelpayouts_token
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix server

# Install frontend dependencies
npm install --prefix frontend
```

### 4. Start the Application

#### Option A: Run Both Together (Recommended)
```bash
npm run dev
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔧 API Configuration

### OpenWeather API
1. Go to [OpenWeather](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Add to `.env`: `OPENWEATHER_API_KEY=your_key`

### Unsplash API
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an application
3. Get your Access Key
4. Add to `.env`: `UNSPLASH_ACCESS_KEY=your_key`

### TomTom API
1. Go to [TomTom Developer Portal](https://developer.tomtom.com/)
2. Create an account
3. Get your API key
4. Add to `.env`: `TOMTOM_API_KEY=your_key`

### TravelPayouts API
1. Go to [TravelPayouts](https://www.travelpayouts.com/)
2. Sign up for an account
3. Get your token
4. Add to `.env`: `TRAVELPAYOUTS_TOKEN=your_token`

## 🗄️ Database Features

### Real Database Mode (USE_MOCKS=false)
- ✅ User registration and login
- ✅ Trip creation and management
- ✅ Data persistence across sessions
- ✅ Full CRUD operations
- ✅ User authentication with sessions

### Mock Mode (USE_MOCKS=true)
- ✅ Quick development without database
- ✅ Sample data for testing
- ✅ No database setup required
- ❌ No data persistence

## 🎨 Frontend Features

### Enhanced Animations
- ✅ Smooth GSAP animations
- ✅ Responsive design
- ✅ Custom CSS animations
- ✅ Hover effects and transitions

### API Integration
- ✅ Weather data display
- ✅ Dynamic image loading from Unsplash
- ✅ Real-time data fetching
- ✅ Error handling and fallbacks

## 🔍 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your database credentials in `.env`
3. Verify the database exists: `CREATE DATABASE globetrotter;`
4. Try mock mode: `USE_MOCKS=true`

### API Issues
1. Check your API keys in `.env`
2. Verify API quotas and limits
3. Check network connectivity
4. Review browser console for errors

### Port Conflicts
- Backend runs on port 5001 by default
- Frontend runs on port 5173 by default
- Change ports in `.env` if needed

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 🎯 Key Features

### Homepage
- ✅ Dynamic banner images from Unsplash
- ✅ City images fetched from API
- ✅ Trip images with real data
- ✅ Smooth animations and transitions

### Weather Integration
- ✅ Current weather display
- ✅ Temperature, humidity, wind data
- ✅ Location-based weather lookup

### Trip Management
- ✅ Create new trips
- ✅ View trip details
- ✅ Budget tracking
- ✅ Date management

### User Authentication
- ✅ Registration and login
- ✅ Session management
- ✅ Profile management
- ✅ Secure password handling

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong session secrets
3. Configure proper database credentials
4. Set up environment-specific API keys
5. Enable HTTPS
6. Configure proper CORS settings

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables
3. Ensure all dependencies are installed
4. Test database connectivity
5. Verify API key validity

---

**Happy Traveling! 🌍✈️**
