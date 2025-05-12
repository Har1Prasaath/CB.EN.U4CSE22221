// src/pages/StockPage.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import StockChart from '../components/StockChart';
import axios from 'axios';

const StockPage = () => {
  const [ticker, setTicker] = useState('');
  const [minutes, setMinutes] = useState('15');
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/stock/${ticker}?m=${minutes}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Stock Page</Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField label="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} />
        <TextField label="Minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        <Button variant="contained" onClick={handleFetch}>Fetch</Button>
      </Box>
      {data && <StockChart data={data} />}
    </Box>
  );
};

export default StockPage;
