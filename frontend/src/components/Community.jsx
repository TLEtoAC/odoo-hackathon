import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid
} from "@mui/material";

const Community = () => {
  const [posts, setPosts] = useState([]);

  // Fetch community posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/community");
        const data = await res.json();
        setPosts(data.posts); // expects { posts: [ { id, userAvatar, content } ] }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

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

     
      <Typography variant="h6" align="center" gutterBottom>
        Community tab
      </Typography>

      
      <Box>
        {posts.map((post) => (
          <Grid container spacing={2} alignItems="flex-start" key={post.id} mb={2}>
          
            <Grid item xs={2} sm={1}>
              <Avatar src={post.userAvatar} alt="User" sx={{ width: 48, height: 48 }} />
            </Grid>

          
            <Grid item xs={10} sm={11}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                {post.content}
              </Paper>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Container>
  );
};

export default Community;
