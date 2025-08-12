import { useState } from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import StartingPage from './components/StartingPage'
import EntryScreen from './components/EntryScreen'
import Homepage from './components/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLanding from "./components/MainLanding"
import QuickStart from './components/QuickStart'
import UserProfile from './pages/UserProfile'
import CreateNewTrip from './components/CreateNewTrip'
import CalenderPage from './components/Calender'
import AddSection from './components/AddSection'
import AdminPanel from './components/AdminPanel'
import ActivitySection from './components/ActivitySection'
import Budget from './components/Budget'
import CommunityPage from './components/CommunityPage'
import ItineraryBuilder from './components/ItineraryBuilder'
import BudgetManager from './components/BudgetManager'
import UserTrip from './components/UserTripList'
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import './App.css'
import TripMap from './components/TripMap'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
      AOS.init({
        duration: 700,    
        easing: "ease-out-cubic",
        once: true,       
        mirror: false      
      });
    }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/entry" element={<EntryScreen />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLanding /></ProtectedRoute>} />
          <Route path="/main" element={<ProtectedRoute><MainLanding /></ProtectedRoute>} />
          <Route path="/quick-start" element={<QuickStart />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><CreateNewTrip /></ProtectedRoute>} />
          <Route path="/Calender" element={<ProtectedRoute><CalenderPage /></ProtectedRoute>} />
          <Route path="/Admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/Community" element={<ProtectedRoute><CommunityPage/></ProtectedRoute>} />
          <Route path="/itinerary/:tripId" element={<ProtectedRoute><ItineraryBuilder/></ProtectedRoute>} />
          <Route path="/budget/:tripId" element={<ProtectedRoute><BudgetManager/></ProtectedRoute>} />
          <Route path="/Add" element={<ProtectedRoute><AddSection /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/active" element={<ProtectedRoute><ActivitySection /></ProtectedRoute>} />  
          <Route path="/userTrip" element={<ProtectedRoute><UserTrip /></ProtectedRoute>} />  
          <Route path="/trip/:tripId/map" element={<ProtectedRoute><RouteTripMap /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const RouteTripMap = () => {
  const params = new URLSearchParams(window.location.search);
  // support both /trip/:tripId/map and /trip/map?tripId=ID
  const tripIdFromPath = window.location.pathname.split('/')[2];
  const tripId = tripIdFromPath || params.get('tripId');
  return <div className="max-w-5xl mx-auto p-4"><TripMap tripId={tripId} /></div>;
}

export default App
