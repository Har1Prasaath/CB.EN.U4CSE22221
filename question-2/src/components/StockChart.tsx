// src/components/StockChart.tsx
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const StockChart = ({ data }: { data: { averagePrice: number; priceHistory: { price: number; lastUpdatedAt: string }[] } }) => {
  const times = data.priceHistory.map(d => new Date(d.lastUpdatedAt).toLocaleTimeString());
  const prices = data.priceHistory.map(d => d.price);

  return (
    <>
      <Typography variant="h6">Average Price: ₹{data.averagePrice.toFixed(2)}</Typography>
      <LineChart
        xAxis={[{ data: times, label: 'Time' }]}
        series={[{ data: prices, label: 'Price' }]}
        width={700}
        height={400}
      />
    </>
  );
};

export default StockChart;
