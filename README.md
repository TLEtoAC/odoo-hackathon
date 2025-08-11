# 🌍 GlobeTrotter - Personalized Travel Planning Platform

GlobeTrotter is a comprehensive, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. Built for the hackathon, this application empowers users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool that combines flexibility and interactivity.

## ✨ Features

### 🚀 Core Functionality
- **User Authentication & Profiles** - Secure login/signup with personalized profiles
- **Trip Management** - Create, edit, and manage multi-city itineraries
- **Itinerary Builder** - Interactive interface to add cities, dates, and activities
- **City & Activity Discovery** - Search and explore destinations and experiences
- **Budget Tracking** - Automatic cost breakdowns and budget management
- **Trip Sharing** - Public and private trip sharing capabilities
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🎯 Key Components
1. **Dashboard** - Central hub showing upcoming trips and quick actions
2. **Trip Creation** - Form-based trip initialization with dates and descriptions
3. **Itinerary Management** - Day-wise trip planning with drag-and-drop functionality
4. **City Search** - Discover cities with cost index and popularity metrics
5. **Activity Search** - Browse activities by type, cost, and duration
6. **Budget Analysis** - Visual cost breakdowns and expense tracking
7. **Trip Calendar** - Timeline view of complete itineraries
8. **Public Sharing** - Shareable trip pages for inspiration

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Passport.js with local strategy and session-based auth
- **Validation**: Express-validator for request validation
- **Security**: Helmet, CORS, rate limiting, express-session
- **File Upload**: Multer for image handling

### Frontend (React + Tailwind CSS)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **Icons**: React Icons library

### Database Schema
- **Users**: Authentication and profile data
- **Trips**: Trip metadata and settings
- **Cities**: Geographic and cultural information
- **Activities**: Things to do with pricing and details
- **TripStops**: Itinerary stops within trips
- **TripActivities**: Scheduled activities with timing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd globetrotter
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Backend environment
   cp env.example .env
   
   # Frontend environment
   cd client
   cp env.example .env
   cd ..
   ```
   
   Update the backend `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=globetrotter_db
   DB_PORT=5432
   SESSION_SECRET=your_session_secret_key_here
   SESSION_MAX_AGE=86400000
   ```
   
   Update the frontend `.env` file with your API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Database Setup**
   ```bash
   # Create PostgreSQL database
   psql -U postgres
   CREATE DATABASE globetrotter_db;
   \q
   ```

6. **Start the Application**
   ```bash
   # Start backend server (from root directory)
   npm run dev
   
   # Start frontend (from client directory)
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📚 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/register` | User registration | `{ email, password, firstName, lastName }` | User profile + success message |
| `POST` | `/login` | User login | `{ email, password }` | User profile + success message |
| `POST` | `/logout` | User logout | None (requires auth) | Success message |
| `GET` | `/profile` | Get user profile | None (requires auth) | User profile data |
| `PUT` | `/profile` | Update user profile | `{ firstName, lastName, email }` | Updated user profile |
| `PUT` | `/change-password` | Change password | `{ currentPassword, newPassword }` | Success message |
| `DELETE` | `/account` | Delete account | `{ password }` | Success message |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/` | Get dashboard data | None | Upcoming trips, recent trips, popular cities, budget highlights |
| `GET` | `/stats` | Get trip statistics | `period` (month/quarter/year) | Trip counts, budget stats, monthly breakdown |
| `GET` | `/budget` | Get budget overview | `period` (month/quarter/year) | Budget breakdown, utilization stats |

### Trips (`/api/trips`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/` | Create new trip | `{ name, startDate, endDate, description, budget }` | Created trip data |
| `GET` | `/my-trips` | Get user's trips | Query: `page`, `limit`, `status` | List of trips with pagination |
| `GET` | `/:id` | Get trip details | None | Trip details with stops and activities |
| `PUT` | `/:id` | Update trip | `{ name, startDate, endDate, description, budget, status }` | Updated trip data |
| `DELETE` | `/:id` | Delete trip | None | Success message |
| `GET` | `/public` | Get public trips | Query: `page`, `limit`, `country` | List of public trips |

### Itinerary (`/api/itinerary`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/:tripId` | Get trip itinerary | None | Complete itinerary with stops and activities |
| `POST` | `/:tripId/stops` | Add stop to itinerary | `{ cityId, arrivalDate, departureDate, estimatedCost, notes }` | Created stop data |
| `PUT` | `/:tripId/stops/:stopId` | Update itinerary stop | `{ arrivalDate, departureDate, estimatedCost, notes }` | Success message |
| `DELETE` | `/:tripId/stops/:stopId` | Remove stop from itinerary | None | Success message |
| `POST` | `/:tripId/stops/:stopId/activities` | Add activity to stop | `{ activityId, startTime, endTime, notes }` | Created activity data |
| `PUT` | `/:tripId/stops/:stopId/activities/:activityId` | Update trip activity | `{ startTime, endTime, notes }` | Success message |
| `DELETE` | `/:tripId/stops/:stopId/activities/:activityId` | Remove activity from stop | None | Success message |
| `PUT` | `/:tripId/reorder` | Reorder stops in itinerary | `{ stopIds: [id1, id2, ...] }` | Success message |

### Budget (`/api/budget`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/:tripId` | Get trip budget breakdown | None | Budget breakdown by category and stop |
| `PUT` | `/:tripId` | Update trip budget | `{ budget }` | Updated budget data |

### Explore (`/api/explore`)
| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/cities/search` | Search cities | `q`, `country`, `region`, `page`, `limit`, `sortBy`, `sortOrder` | List of cities with pagination |
| `GET` | `/cities/popular` | Get popular cities | `limit`, `country` | List of popular cities |
| `GET` | `/cities/countries` | Get countries list | None | List of countries with city counts |
| `GET` | `/cities/countries/:countryCode` | Get cities by country | `page`, `limit` | List of cities in country |
| `GET` | `/cities/:cityId` | Get city details | None | City details with activities |
| `GET` | `/activities/search` | Search activities | `q`, `type`, `category`, `cityId`, `minCost`, `maxCost`, `minDuration`, `maxDuration`, `difficulty`, `page`, `limit`, `sortBy`, `sortOrder` | List of activities with pagination |
| `GET` | `/activities/popular` | Get popular activities | `cityId`, `limit` | List of popular activities |
| `GET` | `/activities/types` | Get activity types | None | List of activity types |
| `GET` | `/activities/:activityId` | Get activity details | None | Activity details with city info |

## 📊 Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Trip
```json
{
  "id": 1,
  "name": "European Adventure",
  "description": "Exploring Europe's finest cities",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "budget": 5000,
  "status": "planned",
  "isPublic": false,
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### City
```json
{
  "id": 1,
  "name": "Paris",
  "country": "France",
  "countryCode": "FRA",
  "region": "Île-de-France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "costIndex": 85,
  "popularity": 95,
  "description": "City of Light",
  "highlights": ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
  "images": ["paris1.jpg", "paris2.jpg"],
  "currency": "EUR"
}
```

### Activity
```json
{
  "id": 1,
  "name": "Eiffel Tower Visit",
  "description": "Iconic Paris landmark",
  "type": "sightseeing",
  "category": "landmarks",
  "duration": 120,
  "cost": 25.00,
  "currency": "EUR",
  "costType": "per_person",
  "location": "Champ de Mars",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "difficulty": "easy",
  "rating": 4.5,
  "reviewCount": 1250,
  "cityId": 1
}
```

### TripStop
```json
{
  "id": 1,
  "tripId": 1,
  "cityId": 1,
  "arrivalDate": "2024-06-01",
  "departureDate": "2024-06-04",
  "estimatedCost": 800,
  "notes": "Stay in Montmartre area",
  "order": 1
}
```

### TripActivity
```json
{
  "id": 1,
  "tripStopId": 1,
  "activityId": 1,
  "startTime": "2024-06-01T14:00:00.000Z",
  "endTime": "2024-06-01T16:00:00.000Z",
  "notes": "Book tickets in advance"
}
```

## 🔒 Security Features

- **Passport.js Authentication** with local strategy and session management
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet Security** headers
- **Session Security** with httpOnly cookies and secure session store
- **SQL Injection Protection** via Sequelize ORM

## 📱 Frontend Integration

### Authentication Flow
1. User submits login/register form
2. Frontend sends request to `/api/auth/login` or `/api/auth/register`
3. Backend validates credentials and creates session
4. Frontend receives user data and updates state
5. Subsequent requests include session cookies automatically

### API Service Configuration
```javascript
// Frontend should use withCredentials: true for session cookies
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Error Handling
- 401 responses should redirect to login
- 403 responses indicate insufficient permissions
- 422 responses contain validation errors
- 500 responses indicate server errors

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure reverse proxy (Nginx/Apache)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for the hackathon challenge
- Inspired by modern travel planning needs
- Uses open-source technologies and libraries
- Community-driven development approach

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**GlobeTrotter** - Making travel planning as exciting as the trip itself! ✈️🌍