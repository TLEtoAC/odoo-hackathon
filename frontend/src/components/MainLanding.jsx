import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
// Material UI Icons
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SortIcon from "@mui/icons-material/Sort";
import LuggageIcon from "@mui/icons-material/Luggage";
import AddIcon from "@mui/icons-material/Add";

const MainLanding = () => {
  const headerRef = useRef(null);
  const bannerRef = useRef(null);
  const topRegionsRef = useRef([]);
  const tripsRef = useRef([]);
  const buttonRef = useRef(null);

  
  topRegionsRef.current = [];
  tripsRef.current = [];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { autoAlpha: 0, y: -60 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 1, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        topRegionsRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          delay: 0.4,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );

      gsap.fromTo(
        tripsRef.current,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.15,
          delay: 0.7,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        buttonRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, delay: 1, duration: 0.5, ease: "power3.out" }
      );
    });

    return () => ctx.revert(); // Cleanup GSAP animations on unmount
  }, []);

  const regions = ["Europe", "Asia", "America", "Africa"];
  const trips = ["Paris", "Tokyo", "New York"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header
        ref={headerRef}
        className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-md"
      >
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FlightTakeoffIcon /> GlobalTrotter
        </h1>
        <Link to="/profile">
        <AccountCircleIcon sx={{ fontSize: 36, color: "#3B82F6" }} />
        </Link>
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
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-lg pl-10 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <ViewModuleIcon fontSize="small" /> Group by
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <FilterListIcon fontSize="small" /> Filter
          </button>
          <button className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200">
            <SortIcon fontSize="small" /> Sort by
          </button>
        </div>
      </div>

    
      <section className="px-4 sm:px-8 py-4">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">
          Top Regional Selections
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <div
              key={region}
              ref={(el) => (topRegionsRef.current[i] = el)}
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer aspect-square rounded-lg flex flex-col items-center justify-center text-blue-700 font-medium shadow-sm transition overflow-hidden relative"
            >
              <img
                src={`https://placehold.co/150x150/6EE7B7/1F2937?text=${region}`}
                alt={region}
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute bottom-1 left-1 text-white font-semibold bg-black bg-opacity-50 px-2 rounded">
                {region}
              </span>
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
              className="bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg flex flex-col items-center justify-center text-blue-700 font-medium aspect-[3/4] shadow-sm transition overflow-hidden relative"
            >
              <img
                src={`https://placehold.co/300x400/93C5FD/1E40AF?text=${trip}`}
                alt={trip}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-2 left-2 text-white font-semibold bg-blue-900 bg-opacity-70 px-3 py-1 rounded flex items-center">
                <LuggageIcon sx={{ marginRight: "8px" }} />
                {trip}
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <button
        ref={buttonRef}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 transition"
      >
        <AddIcon />
        Plan a Trip
      </button>
    </div>
  );
};

export default MainLanding;
