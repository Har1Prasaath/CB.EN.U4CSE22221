// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StockPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
