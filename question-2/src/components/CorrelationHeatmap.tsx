import React from "react";
import HeatMap from "react-heatmap-grid";
import { Paper, Typography, Box } from "@mui/material";

interface CorrelationData {
  stock1: string;
  stock2: string;
  correlation: number;
}

interface Props {
  data: CorrelationData[];
}

const CorrelationHeatmap: React.FC<Props> = ({ data }) => {
  const stockLabels = Array.from(new Set(data.flatMap(d => [d.stock1, d.stock2])));

  const matrix = stockLabels.map(row =>
    stockLabels.map(col => {
      if (row === col) return 1;
      const match = data.find(d =>
        (d.stock1 === row && d.stock2 === col) || (d.stock1 === col && d.stock2 === row)
      );
      return match ? match.correlation : 0;
    })
  );

  const getCorrelationDescription = (value: number): string => {
    if (value >= 0.7) return "Strong positive correlation";
    if (value >= 0.5) return "Moderate positive correlation";
    if (value >= 0.3) return "Weak positive correlation";
    if (value > -0.3) return "Little or no correlation";
    if (value > -0.5) return "Weak negative correlation";
    if (value > -0.7) return "Moderate negative correlation";
    return "Strong negative correlation";
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 5 }}>
      <Typography variant="h5" gutterBottom align="center">
        Stock Correlation Heatmap
      </Typography>

      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <HeatMap
          xLabels={stockLabels}
          yLabels={stockLabels}
          data={matrix}
          squares
          height={50}
          cellStyle={(_background: string, value: number) => ({
            background: value > 0 
              ? `rgba(0, 128, 0, ${Math.abs(value)})` 
              : `rgba(220, 20, 60, ${Math.abs(value)})`,
            color: Math.abs(value) > 0.5 ? "#fff" : "#000",
            fontSize: "14px",
            fontWeight: "bold",
            border: "1px solid #ddd",
            textAlign: "center",
            padding: "10px"
          })}
          cellRender={(value: number) => (
            <div title={getCorrelationDescription(value)}>
              {value.toFixed(4)}
            </div>
          )}
        />
      </Box>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">Correlation Legend:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(220, 20, 60, 0.8)", mr: 1 }} />
            <Typography variant="body2">Strong negative</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(220, 20, 60, 0.5)", mr: 1 }} />
            <Typography variant="body2">Moderate negative</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(220, 20, 60, 0.3)", mr: 1 }} />
            <Typography variant="body2">Weak negative</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(150, 150, 150, 0.3)", mr: 1 }} />
            <Typography variant="body2">Little/no correlation</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(0, 128, 0, 0.3)", mr: 1 }} />
            <Typography variant="body2">Weak positive</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(0, 128, 0, 0.5)", mr: 1 }} />
            <Typography variant="body2">Moderate positive</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "rgba(0, 128, 0, 0.8)", mr: 1 }} />
            <Typography variant="body2">Strong positive</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;
