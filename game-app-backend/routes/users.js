const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all favorites for the logged-in user
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user.favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error retrieving favorites' });
  }
});

// Add a game to favorites
router.post('/favorites', auth, async (req, res) => {
  const { id, name, background_image, released, rating, genres } = req.body;

  if (!id || !name || !rating) {
    return res.status(400).json({ message: 'Missing required game fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAlreadyFavorite = user.favorites.some(
      (game) => String(game.id) === String(id)
    );

    if (isAlreadyFavorite) {
      return res.status(400).json({ message: 'Game is already in your favorites' });
    }

    user.favorites.push({
      id,
      name,
      background_image,
      released,
      rating,
      genres: genres || []
    });

    await user.save();
    return res.status(201).json(user.favorites);
  } catch (err) {
    console.error('Add Favorite Error:', err);
    return res.status(500).json({ message: 'Server error adding to favorites' });
  }
});

// Remove a game from favorites
router.delete('/favorites/:gameId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(
      (game) => String(game.id) !== String(req.params.gameId)
    );

    await user.save();
    return res.json(user.favorites);
  } catch (err) {
    console.error('Remove Favorite Error:', err);
    return res.status(500).json({ message: 'Server error removing from favorites' });
  }
});

module.exports = router;
