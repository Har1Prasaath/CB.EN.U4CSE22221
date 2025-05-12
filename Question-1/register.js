// register.js
const express = require('express');
const { authMiddleware } = require('./authMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/secure-data', authMiddleware, (req, res) => {
    res.json({
        message: "Secure data accessed",
        token: req.authToken
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
