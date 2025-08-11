import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from "@mui/material";
import { gsap } from "gsap";

const UserTrip = () => {
  const [trips, setTrips] = useState({
    ongoing: [],
    upcoming: [],
    completed: []
  });
  const sectionRefs = useRef([]);

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips"); // replace with your API
        const data = await res.json();

        // Assuming backend returns { ongoing: [], upcoming: [], completed: [] }
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  // Animate trip cards
  useEffect(() => {
    if (sectionRefs.current.length > 0) {
      gsap.from(sectionRefs.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  }, [trips]);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Top Bar */}
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

      {/* Ongoing */}
      <Typography variant="h6" gutterBottom>
        Ongoing
      </Typography>
      {trips.ongoing.map((trip, i) => (
        <Paper
          key={`ongoing-${i}`}
          ref={(el) => (sectionRefs.current[i] = el)}
          elevation={2}
          sx={{ p: 2, borderRadius: 2, mb: 2 }}
        >
          {trip}
        </Paper>
      ))}

      {/* Upcoming */}
      <Typography variant="h6" gutterBottom>
        Upcoming
      </Typography>
      {trips.upcoming.map((trip, i) => (
        <Paper
          key={`upcoming-${i}`}
          ref={(el) => (sectionRefs.current[trips.ongoing.length + i] = el)}
          elevation={2}
          sx={{ p: 2, borderRadius: 2, mb: 2 }}
        >
          {trip}
        </Paper>
      ))}

      {/* Completed */}
      <Typography variant="h6" gutterBottom>
        Completed
      </Typography>
      {trips.completed.map((trip, i) => (
        <Paper
          key={`completed-${i}`}
          ref={(
            el
          ) => (sectionRefs.current[trips.ongoing.length + trips.upcoming.length + i] = el)}
          elevation={2}
          sx={{ p: 2, borderRadius: 2, mb: 2 }}
        >
          {trip}
        </Paper>
      ))}
    </Container>
  );
};

export default UserTrip;
