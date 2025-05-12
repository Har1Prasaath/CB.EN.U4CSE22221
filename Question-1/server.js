// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { getAuthToken } = require('./authMiddleware');

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const BASE_URL = "http://20.244.56.144/evaluation-service";

// ✅ Route 1: Get Average Stock Price in last `m` minutes
app.get('/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    if (aggregation !== 'average') {
        return res.status(400).json({ error: "Invalid aggregation type. Only 'average' supported." });
    }

    try {
        const token = await getAuthToken();
        const response = await axios.get(`${BASE_URL}/stocks/${ticker}?minutes=${minutes}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const priceHistory = response.data;
        const prices = priceHistory.map(p => p.price);
        const averageStockPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

        return res.json({ averageStockPrice, priceHistory });
    } catch (error) {
        console.error("Error fetching stock price:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// ✅ Route 2: Get Correlation Between Two Stocks
app.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker } = req.query;

    if (!ticker || ticker.length !== 2) {
        return res.status(400).json({ error: "Provide exactly two tickers" });
    }

    try {
        const token = await getAuthToken();
        const [ticker1, ticker2] = ticker;

        const [res1, res2] = await Promise.all([
            axios.get(`${BASE_URL}/stocks/${ticker1}?minutes=${minutes}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${BASE_URL}/stocks/${ticker2}?minutes=${minutes}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ]);

        const data1 = res1.data;
        const data2 = res2.data;

        const aligned = alignTimestamps(data1, data2);
        const { prices1, prices2 } = aligned;

        const correlation = calculateCorrelation(prices1, prices2);
        const avg1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
        const avg2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;

        return res.json({
            correlation: parseFloat(correlation.toFixed(4)),
            stocks: {
                [ticker1]: {
                    averagePrice: avg1,
                    priceHistory: data1
                },
                [ticker2]: {
                    averagePrice: avg2,
                    priceHistory: data2
                }
            }
        });

    } catch (error) {
        console.error("Error computing correlation:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

function alignTimestamps(prices1, prices2) {
    const map2 = new Map(prices2.map(p => p.lastUpdatedAt.slice(0, 16), p => p.price));
    const commonTimestamps = prices1
        .filter(p1 => map2.has(p1.lastUpdatedAt.slice(0, 16)));

    const pricesAligned1 = [];
    const pricesAligned2 = [];

    commonTimestamps.forEach(p1 => {
        pricesAligned1.push(p1.price);
        pricesAligned2.push(map2.get(p1.lastUpdatedAt.slice(0, 16)));
    });

    return { prices1: pricesAligned1, prices2: pricesAligned2 };
}

function calculateCorrelation(X, Y) {
    const n = X.length;
    const meanX = X.reduce((a, b) => a + b, 0) / n;
    const meanY = Y.reduce((a, b) => a + b, 0) / n;

    const numerator = X.reduce((sum, xi, i) => sum + (xi - meanX) * (Y[i] - meanY), 0);
    const denominator = Math.sqrt(
        X.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
        Y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
    );

    return numerator / denominator;
}

app.listen(PORT, () => {
    console.log(`Stock microservice running at http://localhost:${PORT}`);
});
