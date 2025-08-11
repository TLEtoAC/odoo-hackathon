import { useState } from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLanding from "./components/MainLanding"
import UserProfile from './pages/UserProfile'
import CreateNewTrip from './components/CreateNewTrip'
import CalenderPage from './components/Calender'
import AddSection from './components/AddSection'
import AdminPanel from './components/AdminPanel'
import ActivitySection from './components/ActivitySection'
import Budget from './components/Budget'
import Community from './components/Community'
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainLanding />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/new" element={<CreateNewTrip />} />
        <Route path="/Calender" element={<CalenderPage />} />
        <Route path="/Admin" element={<AdminPanel />} />
        <Route path="/Community" element={<Community/>} />
        <Route path="/Add" element={<AddSection />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/active" element={<ActivitySection />} />  
        <Route path="/userTrip" element={<UserTrip />} />  
        <Route path="/trip/:tripId/map" element={<RouteTripMap />} />
      </Routes>
    </BrowserRouter>
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
