const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node to bypass local ISP router blocks

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");


const app = express();

// Middleware
app.use(cors()); // Allows React to make requests to this backend
app.use(express.json({limit: '10mb'})); // Allows our server to accept JSON data in request bodies

// Simple Health Check Route
app.get('/api/games', (req, res) => {
  res.send('Game App API Server is running...');
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
    // Only start the server if our database connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });