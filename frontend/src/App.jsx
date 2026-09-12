import { Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import { GameProvider } from './contexts/GameContext';
import { useAuth, AuthProvider } from './contexts/AuthContext';

// Redirect logged-out users away from protected routes to /login
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user } = useAuth();
  return user ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from auth pages (/login & /register) to /
const PublicOnlyRoute = ({ element: Element, ...rest }) => {
  const { user } = useAuth();
  return !user ? <Element {...rest} /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="app-container">
          <NavBar />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Guest-only Auth Routes */}
              <Route path="/register" element={<PublicOnlyRoute element={Register} />} />
              <Route path="/login" element={<PublicOnlyRoute element={Login} />} />

              {/* Protected User Routes */}
              <Route path="/favorites" element={<ProtectedRoute element={Favorites} />} />
              <Route path="/profile" element={<ProtectedRoute element={Profile} />} />

              {/* Fallback for unknown URLs */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>
              &copy; {new Date().getFullYear()} Game App. All rights reserved.
              Data provided by <a href="https://rawg.io/" target="_blank" rel="noopener noreferrer">RAWG API</a>.
            </p>
          </footer>
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;