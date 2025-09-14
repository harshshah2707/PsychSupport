import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      {/* Left side: Brand */}
      <div className="navbar-brand">
        <Link to="/">PsychSupport</Link>
      </div>

      {/* Right side: hamburger + menu */}
      <div className="navbar-right">
        {/* Hamburger only on mobile */}
        <button
          className="navbar-burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${menuOpen ? "is-active" : ""}`}>
          <Link to="/" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/assessment" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Assessment
          </Link>
          <Link to="/bookings" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Book a Session
          </Link>
          <Link to="/resources" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Resources
          </Link>
          <Link to="/wellness" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Wellness
          </Link>
          <Link to="/profile" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <button onClick={toggleTheme} className="navbar-item theme-toggle">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={handleLogout} className="navbar-item logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
