// authMiddleware.js
const axios = require('axios');

// Credentials
const credentials = {
    email: "cb.en.u4cse22221@cb.students.amrita.edu",
    name: "Hari Prasaath",
    rollNo: "CB.EN.U4CSE22221",
    accessCode: "SwuuKE",
    clientID: "aac0e0b3-f869-4d95-9a26-ae19b6823599",
    clientSecret: "ZbsssKbzNgWSUrpF"
};

// Middleware to get and store token
let cachedToken = null;

const getAuthToken = async () => {
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', credentials);
    cachedToken = response.data.access_token;
    return cachedToken;
  } catch (error) {
    console.error("Authentication Failed:", error.response?.data || error.message);
    throw new Error("Authentication Error");
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = await getAuthToken();
    req.authToken = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized - Token fetch failed" });
  }
};

module.exports = { authMiddleware, getAuthToken };
