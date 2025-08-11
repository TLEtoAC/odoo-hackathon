import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material";

const AddSection = () => {
  const [sections, setSections] = useState([
    { id: 1, title: "Section 1", info: "All the necessary information about this section.", dateRange: "xxx to yyy", budget: "Budget of this section" },
    { id: 2, title: "Section 2", info: "All the necessary information about this section.", dateRange: "xxx to yyy", budget: "Budget of this section" },
    { id: 3, title: "Section 3", info: "All the necessary information about this section.", dateRange: "xxx to yyy", budget: "Budget of this section" }
  ]);

  const addSection = () => {
    const newId = sections.length + 1;
    setSections([
      ...sections,
      {
        id: newId,
        title: `Section ${newId}`,
        info: "All the necessary information about this section.",
        dateRange: "xxx to yyy",
        budget: "Budget of this section"
      }
    ]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {sections.map((section) => (
        <Card
          key={section.id}
          variant="outlined"
          sx={{ mb: 2, borderRadius: 2 }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {section.title}:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {section.info} <br />
              This can be anything like travel section, hotel or any other activity
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="outlined">Date Range: {section.dateRange}</Button>
              <Button variant="outlined">{section.budget}</Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="outlined"
          onClick={addSection}
          sx={{
            fontSize: "1rem",
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none"
          }}
        >
          + Add another Section
        </Button>
      </Box>
    </Container>
  );
};

export default AddSection;
