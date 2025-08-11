const express = require('express');
const axios = require('axios');
const router = express.Router();

// OpenWeather - Current weather by city name or coordinates
router.get('/weather/current', async (req, res) => {
  try {
    const { q, lat, lon, units = 'metric' } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Missing OPENWEATHER_API_KEY' });
    }
    const params = { appid: apiKey, units };
    if (q) params.q = q;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.response?.status || 500).json({ success: false, message: error.response?.data?.message || 'Weather fetch failed' });
  }
});

// Unsplash - Search photos
router.get('/images/search', async (req, res) => {
  try {
    const { query, page = 1, per_page = 10 } = req.query;
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return res.status(500).json({ success: false, message: 'Missing UNSPLASH_ACCESS_KEY' });
    }
    const { data } = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.response?.status || 500).json({ success: false, message: error.response?.data?.errors?.[0] || 'Image search failed' });
  }
});

// TomTom - Search or reverse geocode
router.get('/maps/geocode', async (req, res) => {
  try {
    const { q, lat, lon, limit = 5 } = req.query;
    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Missing TOMTOM_API_KEY' });
    }
    let url;
    if (q) {
      url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(q)}.json`;
    } else if (lat && lon) {
      url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json`;
    } else {
      return res.status(400).json({ success: false, message: 'Provide q or lat/lon' });
    }
    const { data } = await axios.get(url, { params: { key: apiKey, limit } });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.response?.status || 500).json({ success: false, message: error.response?.data || 'TomTom request failed' });
  }
});

// TravelPayouts - Simple flights search proxy
router.get('/flights/search', async (req, res) => {
  try {
    const { origin, destination, depart_date, return_date, currency = 'USD' } = req.query;
    const token = process.env.TRAVELPAYOUTS_TOKEN;
    if (!token) {
      return res.status(500).json({ success: false, message: 'Missing TRAVELPAYOUTS_TOKEN' });
    }
    const { data } = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
      params: {
        origin,
        destination,
        departure_at: depart_date,
        return_at: return_date,
        currency,
        token,
      },
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.response?.status || 500).json({ success: false, message: error.response?.data?.error || 'Flight search failed' });
  }
});

// Firebase Auth placeholders - frontend uses Firebase SDK directly; these endpoints can verify ID tokens if desired
router.post('/firebase/verify', async (req, res) => {
  // Optionally verify Firebase ID token server-side with Firebase Admin SDK
  res.json({ success: true, message: 'Firebase verification not configured server-side; use client SDK.' });
});

module.exports = router;


