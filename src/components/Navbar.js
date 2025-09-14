import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PsychSupport</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Dashboard</Link>
        <Link to="/assessment" className="navbar-item">Assessment</Link>
        <Link to="/resources" className="navbar-item">Resources</Link>
        <Link to="/wellness" className="navbar-item">Wellness</Link>
        <Link to="/profile" className="navbar-item">Profile</Link>
        <button onClick={toggleTheme} className="navbar-item theme-toggle">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={handleLogout} className="navbar-item logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
