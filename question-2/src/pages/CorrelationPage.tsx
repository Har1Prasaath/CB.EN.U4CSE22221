import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import axios from "axios";

const CorrelationPage: React.FC = () => {
  const [minutes, setMinutes] = useState("15");
  const [data, setData] = useState<any[]>([]);

  const handleFetch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/correlation?m=${minutes}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching correlation data:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Minutes"
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <Button variant="contained" onClick={handleFetch}>
          Fetch
        </Button>
      </Box>
      {data.length > 0 && <CorrelationHeatmap data={data} />}
    </Box>
  );
};

export default CorrelationPage;
