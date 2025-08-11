import React from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";

const pieData = [
  { name: "Category A", value: 40 },
  { name: "Category B", value: 60 }
];
const pieColors = ["#4CAF50", "#2196F3"];

const lineData = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 500 },
  { name: "Apr", uv: 200 },
  { name: "May", uv: 450 }
];

const barData = [
  { name: "A", pv: 2400 },
  { name: "B", pv: 1398 },
  { name: "C", pv: 9800 }
];

export default function AdminPanel() {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
     
      <Box display="flex" gap={1} mb={2}>
        <TextField
          placeholder="Search bar ..."
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button variant="outlined">Group by</Button>
        <Button variant="outlined">Filter</Button>
        <Button variant="outlined">Sort by...</Button>
      </Box>

      <Box display="flex" gap={1} mb={3}>
        <Button variant="outlined">Manage Users</Button>
        <Button variant="outlined">Popular Cities</Button>
        <Button variant="outlined">Popular Activities</Button>
        <Button variant="outlined">User Trends and Analytics</Button>
      </Box>

    
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        sx={{ border: "1px solid #ddd", p: 3, borderRadius: 2 }}
      >
        {/* Pie Chart */}
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            fill="#8884d8"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
        </PieChart>

        {/* Line Chart */}
        <LineChart width={400} height={200} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#f44336" />
        </LineChart>

        {/* Bar Chart */}
        <BarChart width={400} height={200} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#FF9800" />
        </BarChart>
      </Box>
    </Container>
  );
}
