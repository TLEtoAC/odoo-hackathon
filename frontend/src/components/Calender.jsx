import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";

const CalendarPage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips");
        const data = await res.json();
        setTrips(data.trips); // expects { trips: [ { id, title, start, end } ] }
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);

  // Highlight trip days
  const tileContent = ({ date }) => {
    const trip = trips.find(
      (t) => new Date(t.start) <= date && date <= new Date(t.end)
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
        {trip.title}
      </div>
    ) : null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Top bar */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Search bar..."
          variant="outlined"
          size="small"
        />
        <Button variant="outlined">Group by</Button>
        <Button variant="outlined">Filter</Button>
        <Button variant="outlined">Sort by...</Button>
      </Box>

      {/* Page title */}
      <Typography variant="h6" align="center" gutterBottom>
        Calendar View
      </Typography>

      {/* Calendar */}
      <Box display="flex" justifyContent="center">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileContent={tileContent}
        />
      </Box>
    </Container>
  );
};

export default CalendarPage;
