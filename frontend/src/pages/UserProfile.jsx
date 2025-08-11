import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper
} from "@mui/material";
import { gsap } from "gsap";

const UserProfile = () => {
  const profileRef = useRef(null);
  const preplannedRef = useRef([]);
  const previousRef = useRef([]);

  // reset ref arrays each render
  preplannedRef.current = [];
  previousRef.current = [];

  useEffect(() => {
    gsap.from(profileRef.current, {
      y: -50,
      autoAlpha: 0, // opacity + visibility
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(preplannedRef.current, {
      y: 50,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.4
    });

    gsap.from(previousRef.current, {
      y: 50,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      delay: 1
    });
  }, []);

  const tripsData = [
    { title: "Beach Paradise", img: "https://placehold.co/600x400?text=Beach" },
    { title: "Mountain Escape", img: "https://placehold.co/600x400?text=Mountain" },
    { title: "City Lights", img: "https://placehold.co/600x400?text=City" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Section */}
      <Paper
        ref={profileRef}
        elevation={4}
        sx={{
          display: "flex",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          mb: 5,
          borderRadius: 4,
          background: "linear-gradient(135deg, #90caf9, #42a5f5)",
          color: "#fff"
        }}
      >
        <Avatar
          src="https://via.placeholder.com/150"
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mr: { xs: 2, sm: 3 },
            border: "3px solid white"
          }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            John Doe
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            user@example.com
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          >
            Edit Information
          </Button>
        </Box>
      </Paper>

      {/* Preplanned Trips */}
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Preplanned Trips
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {tripsData.map((trip, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              ref={(el) => (preplannedRef.current[i] = el)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "all 0.3s ease"
              }}
            >
              <CardMedia component="img" height="160" image={trip.img} alt={trip.title} />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {trip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore the wonders of {trip.title}.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" fullWidth sx={{ textTransform: "none" }}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Previous Trips */}
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Previous Trips
      </Typography>
      <Grid container spacing={3}>
        {tripsData.map((trip, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              ref={(el) => (previousRef.current[i] = el)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "all 0.3s ease"
              }}
            >
              <CardMedia component="img" height="160" image={trip.img} alt={trip.title} />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {trip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relive your trip to {trip.title}.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" fullWidth sx={{ textTransform: "none" }}>
                  View Memories
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserProfile;
