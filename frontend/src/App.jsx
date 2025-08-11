import { useState } from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLanding from "./components/MainLanding"
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import './App.css'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
