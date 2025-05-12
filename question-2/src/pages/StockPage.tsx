// src/pages/StockPage.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import StockChart from '../components/StockChart';
import axios from 'axios';

const StockPage = () => {
  const [ticker, setTicker] = useState('');
  const [minutes, setMinutes] = useState('15');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!ticker) {
      setError("Please enter a ticker symbol");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `http://localhost:3001/stocks/${ticker}?minutes=${minutes}&aggregation=average`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Stock Price Analysis</Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField 
          label="Ticker Symbol" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value.toUpperCase())} 
          placeholder="e.g., NVDA, AAPL"
          helperText="Enter a valid stock ticker"
        />
        <TextField 
          label="Minutes" 
          type="number" 
          value={minutes} 
          onChange={(e) => setMinutes(e.target.value)} 
          inputProps={{ min: 1 }}
          helperText="Time range in minutes"
        />
        <Button 
          variant="contained" 
          onClick={handleFetch} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </Button>
      </Box>
      
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      
      {data && <StockChart data={data} />}
    </Box>
  );
};

export default StockPage;
