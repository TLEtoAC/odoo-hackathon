import { useState } from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
