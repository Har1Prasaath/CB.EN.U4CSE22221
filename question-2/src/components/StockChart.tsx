// src/components/StockChart.tsx
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper } from '@mui/material';

const StockChart = ({ data }: { data: { averageStockPrice: number; priceHistory: { price: number; lastUpdatedAt: string }[] } }) => {
  if (!data || !data.priceHistory || data.priceHistory.length === 0) {
    return <Typography color="error">No price data available</Typography>;
  }

  const times = data.priceHistory.map(d => new Date(d.lastUpdatedAt).toLocaleTimeString());
  const prices = data.priceHistory.map(d => d.price);

  // Calculate min/max for better visualization
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Average Price: ₹{data.averageStockPrice.toFixed(2)}
      </Typography>
      
      <Box sx={{ height: 400, width: '100%', maxWidth: 1000, mt: 2 }}>
        <LineChart
          xAxis={[{ 
            data: times, 
            label: 'Time',
            scaleType: 'band'
          }]}
          series={[{ 
            data: prices, 
            label: 'Price (₹)',
            area: true,
            showMark: true,
          }]}
          yAxis={[{
            min: minPrice,
            max: maxPrice
          }]}
          height={350}
          margin={{ top: 20, right: 20, bottom: 70, left: 70 }}
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Price history contains {data.priceHistory.length} data points
      </Typography>
    </Paper>
  );
};

export default StockChart;
