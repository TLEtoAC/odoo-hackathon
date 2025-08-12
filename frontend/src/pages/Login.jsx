import React from 'react'
import {useState} from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { FaPlane, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
        
  const handleLogin = async (e) => {
    console.log("handleLogin000000000000000000");
    debugger
        e.preventDefault();
        setLoading(true);
        try{
            const response = await login({email, password});
            console.log('Login successful:', response);
            navigate('/dashboard');
        } catch(err) {
            console.error('Login failed:', err);
            let errorMessage = 'Login failed: ';
            if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
                errorMessage += 'Cannot connect to server. Please ensure the backend is running on http://localhost:4000';
            } else if (err.response?.status === 401) {
                errorMessage += 'Invalid email or password. Please check your credentials and try again.';
            } else if (err.response?.status === 404) {
                errorMessage += 'User not found. Please check your email or register a new account.';
            } else {
                errorMessage += (err.response?.data?.message || err.message);
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-white flex items-center justify-center p-4">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
           <form
              onSubmit={handleLogin}
              className="relative bg-white/90 backdrop-blur-md p-8 shadow-2xl w-full max-w-md rounded-3xl border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300"
           >   
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlane className="text-2xl text-black transform rotate-45" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </div>
                <div className="space-y-6">
                  <div>
                    <label className='text-sm font-semibold text-gray-700 mb-2 block'>Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                      <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors'
                        type="email"
                        placeholder='Enter your email'
                      />
                    </div>
                  </div>
        
                  <div>
                    <label className='text-sm font-semibold text-gray-700 mb-2 block'>Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-4 text-gray-400" />
                      <input
                        className='bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required type="password"
                        placeholder='Enter your password'
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl px-4 py-3 w-full text-lg hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6'
                >{loading ? 'Signing in...' : 'Sign In'}</button>

                
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-yellow-200"></div>
                  <span className="mx-4 text-gray-500 font-medium bg-white px-2">or continue with</span>
                  <div className="flex-grow h-px bg-yellow-200"></div>
                </div>

                
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 bg-white border-2 border-yellow-200 rounded-xl px-4 py-3 w-full text-lg font-medium hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-300"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 bg-black text-white rounded-xl px-4 py-3 w-full text-lg font-medium hover:bg-gray-800 transition-all duration-300"
                  >
                    <img src="https://imgs.search.brave.com/s618w_HRaXhqqMHVyhOw2aDmQLhgjui5w7rAtr2ZKlk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL2ltYWdlc19r/L2FwcGxlLWxvZ28t/dHJhbnNwYXJlbnQt/cG5nL2FwcGxlLWxv/Z28tdHJhbnNwYXJl/bnQtcG5nLTE5Lmpw/Zw" alt="Apple" className="w-5 h-5" />
                    Sign in with Apple
                  </button>
                </div>
   
               
              <div className="text-center">
                <p className='text-gray-600'>Don't have an account? <Link to='/register' className='text-yellow-600 hover:text-yellow-700 font-semibold'>Create Account</Link></p>
              </div>
              <div className="mt-4">
                <p className='text-xs text-gray-500 text-center leading-relaxed'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.</p>
              </div>
            </form>
        </div>
     
        </>
  )
}

export default Login

