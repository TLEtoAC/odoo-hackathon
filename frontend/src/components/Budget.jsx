import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid
} from "@mui/material";

const Budget = ({ placeId }) => {
  const [itinerary, setItinerary] = useState([]);

  // Fetch itinerary from backend
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/itinerary/${placeId}`);
        const data = await res.json();
        setItinerary(data.days); // expects { days: [ { day: 1, activities: [{ activity, expense }] } ] }
      } catch (err) {
        console.error("Error fetching itinerary:", err);
      }
    };
    fetchItinerary();
  }, [placeId]);

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

      {/* Title */}
      <Typography variant="h5" align="center" gutterBottom>
        Itinerary for a selected place
      </Typography>

      {/* Headers */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={8}>
          <Typography variant="subtitle1">Physical Activity</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Expense</Typography>
        </Grid>
      </Grid>

      {/* Itinerary Days */}
      {itinerary.map((dayData, dayIndex) => (
        <Box key={dayIndex} mb={4}>
          <Button variant="outlined" sx={{ mb: 2 }}>
            Day {dayData.day}
          </Button>

          {dayData.activities.map((act, i) => (
            <Grid container spacing={2} alignItems="center" key={i} mb={1}>
              <Grid item xs={8}>
                <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
                  {act.activity}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={2} sx={{ p: 1, borderRadius: 2, textAlign: "right" }}>
                  {act.expense}
                </Paper>
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}
    </Container>
  );
};

export default Budget;
