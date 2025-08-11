import React, { useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { gsap } from "gsap";

const CreateNewTrip = () => {
  const formRef = useRef(null);
  const suggestionRefs = useRef([]);

  useEffect(() => {
    // Animate form
    gsap.from(formRef.current, { y: -40, opacity: 0, duration: 1, ease: "power3.out" });

    // Animate suggestion cards
    gsap.from(suggestionRefs.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.5,
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Plan a New Trip */}
      <Paper
        ref={formRef}
        elevation={3}
        sx={{ p: 3, borderRadius: 3, mb: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Plan a New Trip
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Select a Place"
            placeholder="Enter location"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" sx={{ mt: 1 }}>
            Save Trip
          </Button>
        </Box>
      </Paper>

      {/* Suggestions */}
      <Typography variant="h6" gutterBottom>
        Suggestions for Places to Visit / Activities to Perform
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card
              ref={(el) => (suggestionRefs.current[i] = el)}
              sx={{ height: 150, borderRadius: 3 }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Suggestion {i + 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CreateNewTrip;
