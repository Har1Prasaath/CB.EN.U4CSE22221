import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import axios from "axios";

const CorrelationPage: React.FC = () => {
  const [minutes, setMinutes] = useState("15");
  const [ticker1, setTicker1] = useState("");
  const [ticker2, setTicker2] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<string[]>([]);

  // Fetch available stocks when component mounts
  React.useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:3001/stocks");
        const stocksData = response.data.stocks;
        // Convert stocks object to array of ticker symbols
        const stocksArray = Object.values(stocksData) as string[];
        setStocks(stocksArray);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    
    fetchStocks();
  }, []);

  const handleFetch = async () => {
    if (!ticker1 || !ticker2) {
      setError("Please select two stocks to compare");
      return;
    }

    if (ticker1 === ticker2) {
      setError("Please select two different stocks");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Updated to match backend endpoint
      const response = await axios.get(
        `http://localhost:3001/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`
      );
      
      // Transform the data for the heatmap component
      const correlationData = [
        {
          stock1: ticker1,
          stock2: ticker2,
          correlation: response.data.correlation
        }
      ];
      
      setData(correlationData);
    } catch (error) {
      console.error("Error fetching correlation data:", error);
      setError("Failed to fetch correlation data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Analysis
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel>First Stock</InputLabel>
          <Select
            value={ticker1}
            label="First Stock"
            onChange={(e) => setTicker1(e.target.value)}
          >
            {stocks.map(stock => (
              <MenuItem key={stock} value={stock}>{stock}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel>Second Stock</InputLabel>
          <Select
            value={ticker2}
            label="Second Stock"
            onChange={(e) => setTicker2(e.target.value)}
          >
            {stocks.map(stock => (
              <MenuItem key={stock} value={stock}>{stock}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Minutes"
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          inputProps={{ min: 1 }}
          fullWidth
        />
        
        <Button 
          variant="contained" 
          onClick={handleFetch} 
          disabled={loading}
          sx={{ height: { sm: 56 } }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Correlation'}
        </Button>
      </Box>
      
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      
      {data && data.length > 0 && <CorrelationHeatmap data={data} />}
    </Box>
  );
};

export default CorrelationPage;
