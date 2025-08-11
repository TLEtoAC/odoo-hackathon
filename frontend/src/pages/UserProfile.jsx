import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import { tripsAPI, integrationsAPI } from "../services/api";

const UserProfile = () => {
  const { user, loading, updateProfile } = useAuth();
  const profileRef = useRef(null);
  const preplannedRef = useRef([]);
  const previousRef = useRef([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [preplannedTrips, setPreplannedTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  
  preplannedRef.current = [];
  previousRef.current = [];

  useLayoutEffect(() => {
    let ctx;
    let mounted = true;
    const run = async () => {
      try {
        if (
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }
        const { gsap } = await import("gsap");
        if (!mounted) return;
        ctx = gsap.context(() => {
          gsap.from(profileRef.current, {
            y: -50,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out"
          });

          gsap.from(preplannedRef.current, {
            y: 50,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.3
          });

          gsap.from(previousRef.current, {
            y: 50,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.8
          });
        });
      } catch {}
    };
    run();
    return () => {
      mounted = false;
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoadingTrips(true);
      try {
        const res = await tripsAPI.getUserTrips();
        const list = res?.data?.data?.trips || [];
        const now = new Date();
        const upcoming = [];
        const completed = [];
        list.forEach((t) => {
          const start = t.startDate ? new Date(t.startDate) : null;
          const end = t.endDate ? new Date(t.endDate) : null;
          const status = (t.status || '').toLowerCase();
          if (status === 'completed' || (end && end < now)) completed.push(t);
          else if (status === 'planned' || status === 'upcoming' || (start && start > now) || !end) upcoming.push(t);
          else upcoming.push(t);
        });

        const enhanceWithImages = async (trips) => {
          const limited = trips.slice(0, 6);
          const results = await Promise.all(limited.map(async (trip, i) => {
            try {
              const q = trip.destinations?.[0] || trip.name || 'travel destination';
              const imgRes = await integrationsAPI.searchImages({ query: `${q} travel`, per_page: 1 });
              const imageUrl = imgRes?.data?.data?.results?.[0]?.urls?.regular || null;
              return { ...trip, imageUrl };
            } catch {
              return { ...trip, imageUrl: null };
            }
          }));
          return results;
        };

        const [upImg, compImg] = await Promise.all([
          enhanceWithImages(upcoming),
          enhanceWithImages(completed)
        ]);

        setPreplannedTrips(upImg);
        setPreviousTrips(compImg);
      } catch (e) {
        // fallback placeholders if API fails
        setPreplannedTrips([]);
        setPreviousTrips([]);
      } finally {
        setLoadingTrips(false);
      }
    };
    fetchTrips();
  }, []);

  const handleOpenEdit = () => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || ""
      });
    }
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio
      });
      setToast({ open: true, message: "Profile updated", severity: "success" });
      setOpenEdit(false);
    } catch (e) {
      setToast({ open: true, message: "Failed to update profile", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return "Dates TBD";
    try {
      return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
    } catch {
      return "Dates TBD";
    }
  };

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
    
      <Paper
        ref={profileRef}
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
          textAlign: { xs: "center", sm: "left" },
          gap: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 4 },
          mb: 5,
          borderRadius: 4,
          background: "linear-gradient(135deg, #90caf9, #42a5f5)",
          color: "#fff",
          willChange: "transform, opacity"
        }}
      >
        <Avatar
          src={user?.profilePicture || "https://via.placeholder.com/150"}
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mr: { xs: 2, sm: 3 },
            mb: { xs: 1, sm: 0 },
            border: "3px solid white"
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, wordBreak: "break-word" }}>
            {user?.email || "user@example.com"}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 1, textTransform: "none", fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
            onClick={handleOpenEdit}
          >
            Edit Information
          </Button>
        </Box>
      </Paper>

      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
       <Dialog
  open={openEdit}
  onClose={handleCloseEdit}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: "hidden",
      background: "#f9f9f9",
    }
  }}
>
  {/* Banner */}
  <Box
    sx={{
      height: 120,
      background: "linear-gradient(135deg, #42a5f5, #1976d2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <Avatar
      src={user?.profilePicture || "https://via.placeholder.com/150"}
      sx={{
        width: 90,
        height: 90,
        border: "4px solid white",
        position: "absolute",
        bottom: -45,
      }}
    />
  </Box>

  {/* Title */}
  <DialogTitle
    sx={{
      mt: 6,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#1976d2"
    }}
  >
    Edit Profile
  </DialogTitle>

  {/* Form */}
  <DialogContent sx={{ pb: 0 }}>
    <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
      <TextField
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Bio"
        name="bio"
        value={form.bio}
        onChange={handleChange}
        fullWidth
        multiline
        minRows={3}
        variant="outlined"
      />
    </Box>
  </DialogContent>

  {/* Actions */}
  <DialogActions sx={{ p: 3, pt: 2 }}>
    <Button
      onClick={handleCloseEdit}
      sx={{
        textTransform: "none",
        color: "#555",
        background: "#eeeeee",
        "&:hover": { background: "#e0e0e0" }
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleSave}
      disabled={saving}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      {saving ? "Saving..." : "Save Changes"}
    </Button>
  </DialogActions>
</Dialog>

      </Dialog>

      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Preplanned Trips
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {loadingTrips && <Typography sx={{ px: 2 }}>Loading...</Typography>}
        {!loadingTrips && preplannedTrips.length === 0 && (
          <Typography sx={{ px: 2 }} color="text.secondary">No upcoming trips yet.</Typography>
        )}
        {preplannedTrips.map((trip, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              ref={(el) => (preplannedRef.current[i] = el)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "all 0.3s ease",
                willChange: "transform, opacity"
              }}
            >
              <CardMedia
                component="img"
                image={trip.imageUrl || `https://placehold.co/600x400/93C5FD/1E40AF?text=${encodeURIComponent(trip.name || 'Trip')}`}
                alt={trip.name || 'Trip'}
                sx={{ height: { xs: 140, sm: 160 }, width: '100%', objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {trip.name || 'Trip'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trip.destinations?.join(', ') || 'Destination'} — {formatDateRange(trip.startDate, trip.endDate)}
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

      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Previous Trips
      </Typography>
      <Grid container spacing={3}>
        {loadingTrips && <Typography sx={{ px: 2 }}>Loading...</Typography>}
        {!loadingTrips && previousTrips.length === 0 && (
          <Typography sx={{ px: 2 }} color="text.secondary">No previous trips yet.</Typography>
        )}
        {previousTrips.map((trip, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              ref={(el) => (previousRef.current[i] = el)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "all 0.3s ease",
                willChange: "transform, opacity"
              }}
            >
              <CardMedia
                component="img"
                image={trip.imageUrl || `https://placehold.co/600x400/9CA3AF/111827?text=${encodeURIComponent(trip.name || 'Trip')}`}
                alt={trip.name || 'Trip'}
                sx={{ height: { xs: 140, sm: 160 }, width: '100%', objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {trip.name || 'Trip'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trip.destinations?.join(', ') || 'Destination'} — {formatDateRange(trip.startDate, trip.endDate)}
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
    
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast((t) => ({ ...t, open: false }))}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        severity={toast.severity}
        sx={{ width: "100%" }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default UserProfile;
