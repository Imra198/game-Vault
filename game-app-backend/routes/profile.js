const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET /api/profile
router.get("/", auth, async (req, res) => {
  try {
    // Safely extract ID regardless of JWT payload structure
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.user?.id ||
      req.user?.user?._id;

    if (!userId) {
      console.error("JWT Decoded Payload:", req.user); // Logs payload structure in terminal
      return res.status(400).json({ error: "Invalid user ID in auth token" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ error: "User profile not found in database" });
    }

    res.json({
      user,
      favorites: user.favorites || [],
      stats: user.stats || [],
    });
  } catch (err) {
    console.error("Profile GET Error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch profile data", details: err.message });
  }
});

// PUT /api/profile
router.put("/", auth, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.user?.id ||
      req.user?.user?._id;
      
    const { bio, platforms, favoritePlatforms, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, 
        platforms: platforms || favoritePlatforms, 
        avatar 
      },

      { new: true, runValidators: true },
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile PUT Error:", err);
    res
      .status(500)
      .json({ error: "Failed to update profile", details: err.message });
  }
});

module.exports = router;
