import React, { useEffect, useRef, useState } from 'react';
import { integrationsAPI } from '../services/api';

const RoutePlanner = () => {
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const resetMap = () => {
    if (markersRef.current.length) {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    }
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
  };

  useEffect(() => {
    // Initialize Leaflet map once
    if (!mapInstanceRef.current && window.L && mapRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([20, 0], 2);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const geocode = async (query) => {
    // Try server proxy to TomTom; fallback to Nominatim if unavailable
    try {
      const res = await integrationsAPI.geocode({ q: query, limit: 1 });
      const pos = res?.data?.data?.results?.[0]?.position;
      if (pos && typeof pos.lat === 'number' && typeof pos.lon === 'number') {
        return { lat: pos.lat, lng: pos.lon };
      }
    } catch (_) {}
    // Fallback: public nominatim (no key) for resilience in dev/demo
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (_) {}
    return null;
  };

  const fetchRoute = async (start, end) => {
    try {
      const res = await integrationsAPI.route({
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
      });
      const points = res?.data?.data?.points;
      if (Array.isArray(points) && points.length) {
        return points.map(p => [p.latitude || p.lat, p.longitude || p.lng]);
      }
    } catch (_) {}
    // Fallback: straight line between points
    return [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ];
  };

  const handleShowRoute = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    resetMap();
    try {
      if (!startQuery || !endQuery) {
        setError('Please enter both start and destination');
        return;
      }
      const [startPos, endPos] = await Promise.all([
        geocode(startQuery),
        geocode(endQuery),
      ]);
      if (!startPos || !endPos) {
        setError('Could not find coordinates for one or both locations');
        return;
      }

      // Add markers
      const startMarker = window.L.marker([startPos.lat, startPos.lng]).addTo(mapInstanceRef.current).bindPopup('Start');
      const endMarker = window.L.marker([endPos.lat, endPos.lng]).addTo(mapInstanceRef.current).bindPopup('Destination');
      markersRef.current.push(startMarker, endMarker);

      // Get route polyline
      const latlngs = await fetchRoute(startPos, endPos);
      polylineRef.current = window.L.polyline(latlngs, { color: 'blue', weight: 4, opacity: 0.8 }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(latlngs);
    } finally {
      setIsLoading(false);
    }
  };

  const buildGoogleCalendarUrl = () => {
    if (!startDate || !endDate || !startQuery || !endQuery) return '#';
    const title = `Trip: ${startQuery} to ${endQuery}`;
    // All-day event: end date must be exclusive (add one day)
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '#';
    const endExclusive = new Date(end);
    endExclusive.setDate(endExclusive.getDate() + 1);

    const fmt = (d) => {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };

    const dates = `${fmt(start)}/${fmt(endExclusive)}`;
    const details = 'Planned via GlobeTrotter';
    const location = `${startQuery} to ${endQuery}`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates,
      details,
      location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const canAddToCalendar = startQuery && endQuery && startDate && endDate;

  return (
    <section className="px-4 sm:px-8 py-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">Plan a Quick Route</h2>
      <form onSubmit={handleShowRoute} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <input
          type="text"
          value={startQuery}
          onChange={(e) => setStartQuery(e.target.value)}
          placeholder="Starting point"
          className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 md:col-span-2"
          required
        />
        <input
          type="text"
          value={endQuery}
          onChange={(e) => setEndQuery(e.target.value)}
          placeholder="Destination"
          className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 md:col-span-2"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200"
          required
        />
        <div className="md:col-span-6 flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Show Route on Map'}
          </button>
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg border ${canAddToCalendar ? 'border-blue-600 text-blue-700 hover:bg-blue-50' : 'border-gray-300 text-gray-400 pointer-events-none'}`}
          >
            Add to Google Calendar
          </a>
        </div>
      </form>
      {error && (
        <div className="text-red-600 mb-3">{error}</div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: 360, borderRadius: 12, overflow: 'hidden' }} />
    </section>
  );
};

export default RoutePlanner;

