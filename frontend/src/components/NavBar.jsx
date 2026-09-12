import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaSignOutAlt, 
  FaHeart, 
  FaHome, 
  FaChevronDown 
} from "react-icons/fa";
import AuthModal from "./AuthModal";
import "../css/Navbar.css";
import logo from "../assets/logo.png";

function NavBar() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar-container">
        <nav className="navbar">
          {/* BRAND LOGO */}
          <div className="navbar-brand">
            <Link to="/" className="brand-link" title="GameVault - Home">
              <img src={logo} alt="GameVault" className="brand-logo-img" />
            </Link>
          </div>

          {/* CENTER TITLE */}
          <div className="navbar-center-title">
            <span className="center-title-main">Game</span>
            <span className="center-title-accent">Vault</span>
          </div>

          {/* MAIN NAVIGATION */}
          <div className="navbar-menu">
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link 
                to="/favorites" 
                className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
              >
                <FaHeart className="nav-icon" />
                <span>Favorites</span>
              </Link>
            </div>

            <div className="nav-divider"></div>

            {/* AUTHENTICATION & PROFILE */}
            {user ? (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <button 
                  className={`user-profile-btn ${dropdownOpen ? 'active' : ''}`} 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="avatar-wrapper">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="nav-avatar-img" />
                    ) : (
                      <div className="nav-avatar-initial">{userInitial}</div>
                    )}
                    <span className="status-indicator"></span>
                  </div>
                  <span className="nav-username">{user.username}</span>
                  <FaChevronDown className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
                </button>

                {/* USER PROFILE DROPDOWN */}
                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{user.username}</p>
                      <p className="dropdown-user-email">{user.email || 'Gamer'}</p>
                    </div>

                    <div className="dropdown-separator"></div>

                    <Link 
                      to="/profile" 
                      className="dropdown-item" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="dropdown-icon" />
                      <span>Account Profile</span>
                    </Link>

                    <div className="dropdown-separator"></div>

                    <button 
                      className="dropdown-item logout-item" 
                      onClick={() => { setDropdownOpen(false); logout(); }}
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="login-btn">
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

export default NavBar;