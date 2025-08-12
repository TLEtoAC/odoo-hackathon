import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { FaPlane, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ firstName, lastName, username, email, password });
      navigate('/main');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-white flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <form
        onSubmit={handleRegister}
        className="relative bg-white/90 backdrop-blur-md p-8 shadow-2xl w-full max-w-lg rounded-3xl border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaPlane className="text-2xl text-black transform rotate-45" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent mb-2">Join GlobeTrotter</h2>
          <p className="text-gray-600">Start your travel journey today</p>
        </div>
       
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  required
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  required
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
        
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Username</label>
            <div className="relative">
              <FaUserTag className="absolute left-4 top-4 text-gray-400" />
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                type="text"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-4 text-gray-400" />
              <input
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl pl-12 pr-4 py-3 w-full text-lg placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="Create a password"
              />
            </div>
          </div>
        </div>

        
        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl px-4 py-3 w-full text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-8"
        >
          Create Account
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">Sign In</Link></p>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service</span> apply.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;



// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";

// const AnimatedComponent = () => {
//   const boxRef = useRef(null);

//   useEffect(() => {
//     gsap.fromTo(
//       boxRef.current,
//       { opacity: 0, y: 20 },
//       { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
//     );
//   }, []);

//   return (
//     <div
//       ref={boxRef}
//       className="p-6 max-w-md mx-auto bg-white rounded shadow"
//     >
//       <h2 className="text-xl font-bold mb-4">Welcome</h2>
//       <p>This box fades and slides up on mount.</p>
//     </div>
//   );
// };

// export default AnimatedComponent;
