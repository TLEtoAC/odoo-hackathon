import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/register", { firstName, email, password });

      toast.success("Registered Successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 md:p-8 shadow-lg w-full max-w-md md:max-w-lg rounded-2xl border border-gray-200"
      >
       
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Create Account
        </h2>
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <img
              src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg"
              alt="Register illustration"
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-xl mx-auto"
            />
          </div>
        </div>
       
        <label className="block text-gray-700 mb-1 font-extrabold text-sm sm:text-base">
          What's your name?
        </label>
        <div className="flex flex-col md:flex-row gap-2 mb-5">
          <input
            required
            className="bg-gray-100 flex-1 rounded-lg px-4 py-2 border border-gray-100 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-black"
            type="text"
            placeholder="Enter Full Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        
        </div>

        
        <label className="block text-gray-700 mb-1 font-extrabold text-sm sm:text-base">
          What's your email?
        </label>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-100 mb-5 rounded-lg px-4 py-2 border border-gray-300 w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-black"
          type="email"
          placeholder="email@example.com"
        />

        
        <label className="block text-gray-700 mb-1 font-extrabold text-sm sm:text-base">
          Enter Password
        </label>
        <input
          className="bg-gray-100 mb-6 rounded-lg px-4 py-2 border border-gray-300 w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          placeholder="Password"
        />

        
        <button
          className="bg-black hover:bg-gray-800 transition text-white font-semibold mb-4 rounded-lg px-4 py-2 w-full text-base sm:text-lg shadow-sm"
        >
          Create Account
        </button>

        
        <p className="text-center text-sm text-gray-600 mb-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

       
        <p className="text-[10px] text-gray-500 leading-tight text-center">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
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
