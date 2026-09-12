

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors()); // Allows React to make requests to this backend
app.use(express.json({ limit: '10mb' })); // Allows server to accept JSON data

// Health Check Route
app.get('/', (req, res) => {
  res.send('Game App API Server is running...');
});

// RAWG API Proxy Route
app.get('/api/games', async (req, res) => {
  try {
    const { genres, ordering, parent_platforms, search } = req.query;
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "RAWG API key is missing on the server" });
    }

    let rawgUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

    if (genres) rawgUrl += `&genres=${genres}`;
    if (ordering) rawgUrl += `&ordering=${ordering}`;
    if (parent_platforms) rawgUrl += `&parent_platforms=${parent_platforms}`;
    if (search) rawgUrl += `&search=${encodeURIComponent(search)}`;

    const response = await axios.get(rawgUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from RAWG API:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch games" });
  }
});

// Link routers 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });