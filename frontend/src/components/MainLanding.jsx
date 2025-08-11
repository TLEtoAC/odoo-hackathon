import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
// import { FaUserCircle, FaSearch, FaPlane, FaSuitcase } from "react-icons/fa";
// import { FiFilter, FiGrid, FiSortAscending } from "react-icons/fi";

const MainLanding = () => {
  
  const headerRef = useRef(null);
  const bannerRef = useRef(null);
  const topRegionsRef = useRef([]);
  const tripsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.from(headerRef.current, { y: -60, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from(bannerRef.current, { scale: 0.9, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(topRegionsRef.current, {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      delay: 0.4,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    
    gsap.from(tripsRef.current, {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      delay: 0.7,
      duration: 0.8,
      ease: "power3.out",
    });

    
    gsap.from(buttonRef.current, {
      y: 20,
      opacity: 0,
      delay: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const regions = ["Europe", "Asia", "America", "Africa"];
  const trips = ["Paris", "Tokyo", "New York"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      
      <header ref={headerRef} className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaPlane /> GlobalTrotter
        </h1>
        <FaUserCircle className="text-3xl text-blue-500" />
      </header>

     
      <section
        ref={bannerRef}
        className="w-full h-40 sm:h-60 md:h-72 bg-blue-200 rounded-lg m-4 sm:m-8 flex items-center justify-center shadow-inner"
      >
        <span className="text-lg sm:text-2xl font-semibold text-blue-900">
          Banner Image
        </span>
      </section>

    
      <div className="px-4 sm:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-lg pl-10 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FiGrid /> Group by
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FiFilter /> Filter
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FiSortAscending /> Sort by
          </button>
        </div>
      </div>

      
      <section className="px-4 sm:px-8 py-4">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">Top Regional Selections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <div
              key={region}
              ref={(el) => (topRegionsRef.current[i] = el)}
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer aspect-square rounded-lg flex items-center justify-center text-blue-700 font-medium shadow-sm transition"
            >
              {region}
            </div>
          ))}
        </div>
      </section>

      
      <section className="px-4 sm:px-8 py-4 flex-1">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">Previous Trips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trips.map((trip, i) => (
            <div
              key={trip}
              ref={(el) => (tripsRef.current[i] = el)}
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg flex items-center justify-center text-blue-700 font-medium aspect-[3/4] shadow-sm transition"
            >
              <FaSuitcase className="mr-2" /> {trip}
            </div>
          ))}
        </div>
      </section>

     
      <div className="px-4 sm:px-8 py-4">
        <button
          ref={buttonRef}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow"
        >
          + Plan a Trip
        </button>
      </div>
    </div>
  );
};

export default MainLanding;
