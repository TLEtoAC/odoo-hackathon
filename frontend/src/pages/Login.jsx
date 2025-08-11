import React from 'react'
import axios from "axios";
import {useState , useEffect} from "react"
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Login = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName , setLastName] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("");
        
    const hangleLogin = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:3000/login", {email , password});

            toast.success('Login Successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });


        } catch(err) {
            toast.error('Something Went wrong', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light", 
        });
        }
    }
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
           <form
              onSubmit={hangleLogin}
              className="login-form bg-white p-8 shadow-md w-full max-w-md rounded-2xl"
              style={{ minHeight: "500px" }}
           >   
            <h2 className="text-3xl font-bold mb-4 flex justify-center">Login Now</h2>
            <div className="flex justify-center mb-6">
              <img
                  src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                  alt="Login"
                  className="w-15 h-15"
              />
            </div>
                <h3 className='text-xl font-bold mb-2'>Email</h3>
                <input
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                  type="email"
                  placeholder='email@example.com'
                />
    
                <h3 className='text-xl font-bold mb-2'>Enter Password</h3>
    
                <input
                  className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  required type="password"
                  placeholder='password'
                />
    
                <button
                  className='bg-green-600 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                >Login</button>

                
                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <span className="mx-3 text-gray-500 font-medium">or</span>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                
                <div className="flex flex-col gap-3 mb-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 w-full text-lg font-medium hover:bg-gray-50"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-2 w-full text-lg font-medium hover:bg-gray-800"
                  >
                    <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" alt="Apple" className="w-5 h-5" />
                    Sign in with Apple
                  </button>
                </div>
   
               
              <p className='text-center'>Do'not have a account? <Link to='/register' className='text-blue-600'>Register here</Link></p>
            <div>
              <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
            </div>
            </form>
        </div>
     
        </>
  )
}

export default Login

