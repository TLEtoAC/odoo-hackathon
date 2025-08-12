# 🌍 GlobeTrotter - AI-Powered Travel Planning Platform

A comprehensive travel planning application with AI-powered recommendations, community features, and intelligent itinerary building.

## ✨ Features

- **Entry Screen**: Beautiful cloud animation with golden GlobeTrotter branding
- **AI-Powered Recommendations**: Gemini API integration for personalized travel suggestions
- **Trip Management**: Create, edit, and manage multi-city itineraries
- **Community Sharing**: Share travel experiences and discover others' journeys
- **Budget Tracking**: Comprehensive expense management with visual analytics
- **Itinerary Builder**: Day-wise planning with AI assistant
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Gemini API Key

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd finalc
   npm install
   cd frontend && npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb globetrotter_db
   ```

3. **Environment Configuration**
   
   **Backend (.env)**:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=globetrotter_db
   DB_PORT=5432
   SESSION_SECRET=your_session_secret
   PORT=4000
   ```
   
   **Frontend (.env)**:
   ```env
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start Application**
   ```bash
   # Backend (from root)
   npm run dev
   
   # Frontend (new terminal)
   cd frontend && npm start
   ```

## 🎯 Access Points

- **Entry Screen**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:4000

## 🏗️ Tech Stack

**Frontend**: React, Tailwind CSS, React Router
**Backend**: Node.js, Express, PostgreSQL
**AI**: Google Gemini API
**Authentication**: Passport.js with sessions

## 📱 Key Components

- **EntryScreen**: Animated landing with cloud effects
- **MainLanding**: AI-powered dashboard with trip management
- **CommunityPage**: Social travel experience sharing
- **ItineraryBuilder**: Day-wise planning with AI suggestions
- **BudgetManager**: Expense tracking with visual analytics

## 🔑 API Keys Required

- **Gemini API**: For AI-powered travel recommendations
- **OpenWeather**: Weather data integration
- **Unsplash**: Travel destination images
- **TomTom**: Maps and routing services

## 🚀 Deployment

1. Set production environment variables
2. Build frontend: `npm run build`
3. Deploy backend with PM2 or similar
4. Configure reverse proxy (Nginx)

## 📄 License

MIT License - Built for hackathon challenge

---

**GlobeTrotter** - Making travel planning as exciting as the trip itself! ✈️🌍