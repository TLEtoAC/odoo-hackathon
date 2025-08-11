import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (query.trim() === "") return;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results); 
      } catch (err) {
        console.error("Error fetching search results:", err);
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

      {/* Results title */}
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>

      {/* Results list */}
      <Box display="flex" flexDirection="column" gap={2}>
        {results.map((item) => (
          <Card key={item.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.details}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ActivitySection;
