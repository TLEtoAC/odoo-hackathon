import React, { useEffect, useRef, useState } from 'react';
import { itineraryAPI, integrationsAPI } from '../services/api';

const TripMap = ({ tripId }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!tripId) return;
        const res = await itineraryAPI.getItinerary(tripId);
        const stops = res.data?.data?.itinerary?.flatMap(d => d.stops || []) || [];
        const cities = stops.map(s => s.stop?.city).filter(Boolean);

        // Get coordinates for each city, using existing coords or geocoding
        const coords = await Promise.all(
          cities.map(async (city) => {
            if (city.latitude && city.longitude) {
              return { lat: parseFloat(city.latitude), lng: parseFloat(city.longitude), name: city.name };
            }
            // Try geocoding via TomTom
            try {
              const geo = await integrationsAPI.geocode({ q: `${city.name} ${city.country}` });
              const pos = geo.data?.data?.results?.[0]?.position;
              if (pos) return { lat: pos.lat, lng: pos.lon, name: city.name };
            } catch (e) {}
            return null;
          })
        );

        const waypoints = coords.filter(Boolean);
        if (waypoints.length === 0) {
          setError('No coordinates available for trip route.');
          return;
        }

        // Initialize Leaflet map (global L from CDN)
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = window.L.map(mapRef.current).setView([waypoints[0].lat, waypoints[0].lng], 5);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(mapInstanceRef.current);
        }

        // Add markers
        waypoints.forEach((pt, idx) => {
          window.L.marker([pt.lat, pt.lng]).addTo(mapInstanceRef.current).bindPopup(`${idx + 1}. ${pt.name}`);
        });

        // Draw route polyline
        const latlngs = waypoints.map(pt => [pt.lat, pt.lng]);
        window.L.polyline(latlngs, { color: 'blue', weight: 4, opacity: 0.7 }).addTo(mapInstanceRef.current);
        mapInstanceRef.current.fitBounds(latlngs);
      } catch (e) {
        setError('Failed to load route map.');
      }
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tripId]);

  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div ref={mapRef} style={{ width: '100%', height: '360px', borderRadius: 12, overflow: 'hidden' }} />
    </div>
  );
};

export default TripMap;
