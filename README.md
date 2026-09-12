# Game Vault
Game Vault is a modern full-stack video game discovery web application. It allows users to search for games using real-time data from the RAWG API, explore dynamic platform details, create user accounts, and curate a list of personal favorite titles.

# Features
Live Game Search: Powered by the RAWG REST API for up-to-date gaming information and media.
Platform & Exclusivity Badges: Displays platform availability and calculated exclusive tags automatically.
User Authentication: Secure login and registration functionality protecting personal preferences.
Personal Favorites List: Users can save, view, and manage their favorite games.
Responsive UI: Dark-themed responsive design optimized for mobile and desktop displays.

# Tech Stack
Frontend
React.js
React Router DOM
Context API (State Management)
CSS3 (Flexbox & Grid Layouts)

Backend
Node.js & Express
RESTful API Architecture
User Authentication Logic

# Repository Structure
React Game/
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   └── package.json
└── game-app-backend/     # Node.js/Express API server
    ├── routes/
    ├── models/
    └── package.json

# Local Setup Instructions
Clone the repository:
Run the Backend:
cd game-app-backend
npm install
npm start
Run the Frontend:
cd ../frontend
npm install
npm run dev

# License
This project is licensed under the MIT License - see the LICENSE file for details.


