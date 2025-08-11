import React, { useState, useEffect } from "react";
import { exploreAPI, integrationsAPI } from "../services/api";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent
} from "@mui/material";

const ActivitySection = () => {
  const [query, setQuery] = useState("Paragliding");
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (query.trim() === "") return;
    const fetchData = async () => {
      try {
        // Weather can fail if API key missing; ignore errors per-call
        const [activitiesRes, weatherRes] = await Promise.allSettled([
          exploreAPI.searchActivities({ q: query, limit: 10 }),
          integrationsAPI.getWeather({ q: query })
        ]);
        if (activitiesRes.status === 'fulfilled') {
          setResults(activitiesRes.value.data.data?.activities || []);
        } else {
          setResults([]);
        }
        if (weatherRes.status === 'fulfilled') {
          setWeather(weatherRes.value.data.data || null);
        } else {
          setWeather(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [query]);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Top search bar and buttons */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bar..."
          variant="outlined"
          size="small"
        />
        <Button variant="outlined">Group by</Button>
        <Button variant="outlined">Filter</Button>
        <Button variant="outlined">Sort by...</Button>
      </Box>

      {/* Weather summary */}
      {weather && (
        <Box 
          mb={3} 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 2,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            🌤️ Weather in {weather.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {Math.round(weather.main?.temp)}°C
            </Typography>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {weather.weather?.[0]?.main}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Feels like {Math.round(weather.main?.feels_like)}°C
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={3} mt={1}>
            <Typography variant="body2">
              💨 {weather.wind?.speed} m/s
            </Typography>
            <Typography variant="body2">
              💧 {weather.main?.humidity}%
            </Typography>
          </Box>
        </Box>
      )}

      {/* Results title */}
      <Typography variant="h6" gutterBottom>
        Activities
      </Typography>

      {/* Results list */}
      <Box display="flex" flexDirection="column" gap={2}>
        {results.map((item, index) => (
          <Card 
            key={item.id} 
            variant="outlined"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
                borderColor: 'primary.main'
              },
              animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {item.description || item.type}
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {item.duration && (
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.contrastText',
                        px: 1, py: 0.5, borderRadius: 1
                      }}>
                        ⏱️ {Math.round(item.duration / 60)}h
                      </Typography>
                    )}
                    {item.cost && (
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'success.light', 
                        color: 'success.contrastText',
                        px: 1, py: 0.5, borderRadius: 1
                      }}>
                        💰 {item.cost} {item.currency || 'USD'}
                      </Typography>
                    )}
                    {item.type && (
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'info.light', 
                        color: 'info.contrastText',
                        px: 1, py: 0.5, borderRadius: 1
                      }}>
                        🏷️ {item.type}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ActivitySection;
