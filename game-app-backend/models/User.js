const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  // User Profile Avatar 
  avatar: {
    type: String,
    default: "https://via.placeholder.com/150"
  },

  // User Profile Bio
  bio: {
    type: String,
    trim: true,
    default: ""
  },

  // User Platform Preferences (e.g., PC, PlayStation, Xbox, etc.)
  platforms: [{
    type: String,
    trim: true
  }],

// store an array of favorite game objects directly linked to this user profile
  favorites: [{
    _id: false,

    id: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    background_image: {
      type: String,
      trim: true
    },

    released: {
      type: String,
      trim: true
    },

    rating: {
      type: Number,
      required: true
    },
    genres: [mongoose.Schema.Types.Mixed] // Store genres as an array of mixed types (strings or objects)
  }],

  // Games recently viewed by the user
  recentlyViewed: [{
    gameId: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      trim: true

    },

    background_image: {
      type: String,
      trim: true
    },

    released: {
      type: String,
      trim: true
    },

    rating: {
      type: Number
    },

    viewedAt: {
      type: Date,
      default: Date.now
    }



  }],
}, { // Automatically adds createdAt and updatedAt
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);