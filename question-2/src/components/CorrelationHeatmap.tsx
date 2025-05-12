import React from "react";
import HeatMap from "react-heatmap-grid";

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

  return (
    <div style={{ fontSize: "14px", overflowX: "auto" }}>
      <h2>Stock Correlation Heatmap</h2>
      <HeatMap
        xLabels={stockLabels}
        yLabels={stockLabels}
        data={matrix}
        squares
        height={40}
        cellStyle={(_background, value) => ({
          background: `rgba(0, 123, 255, ${Math.abs(value)})`,
          color: Math.abs(value) > 0.5 ? "#fff" : "#000",
          fontSize: "12px",
          border: "1px solid #ddd"
        })}
        cellRender={value => value.toFixed(2)}
      />
    </div>
  );
};

export default CorrelationHeatmap;
