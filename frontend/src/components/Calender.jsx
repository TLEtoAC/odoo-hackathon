import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";

const CalendarPage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/my-trips`, {
          credentials: 'include'
        });
        const data = await res.json();
        setTrips(data.data?.trips || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);

  // Highlight trip days
  const tileContent = ({ date }) => {
    const trip = trips.find(
      (t) => new Date(t.startDate) <= date && date <= new Date(t.endDate)
    );
    return trip ? (
      <div
        style={{
          backgroundColor: "#ccc",
          borderRadius: "4px",
          fontSize: "0.6rem",
          textAlign: "center",
          padding: "2px"
        }}
      >
        {trip.name}
      </div>
    ) : null;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top bar */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-2 border rounded-lg"
          placeholder="Search bar..."
        />
        <button className="px-4 py-2 border rounded-lg">Group by</button>
        <button className="px-4 py-2 border rounded-lg">Filter</button>
        <button className="px-4 py-2 border rounded-lg">Sort by...</button>
      </div>

      {/* Page title */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Calendar View
      </h2>

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
