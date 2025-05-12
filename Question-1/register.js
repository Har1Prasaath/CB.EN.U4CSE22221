// register.js
const express = require('express');
const { authMiddleware } = require('./authMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());

// Protected route example
app.get('/secure-data', authMiddleware, (req, res) => {
  res.json({ message: "Secure data accessed", token: req.authToken });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
