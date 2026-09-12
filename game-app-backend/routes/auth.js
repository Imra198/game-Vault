const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // validation 
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: normalizedEmail }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      favorites: [] // Starts with an empty favorites array
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error(error);
    console.log('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validation 
  if (!username || !password){
    return res.status(400).json({message:"Please provide username and password" });
  }

try {
  // Find user by their username
  const user = await User.findOne({ username });
  if (!user){
    return res.status(400).json({message:"Invalid username or password"});
  }
  
  // Compare the plain text password with the hashed password from database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ 
      id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

 //Allows server.js to use these routes
module.exports = router;


