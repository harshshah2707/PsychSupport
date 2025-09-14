import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Resources from './pages/Resources';
import Wellness from './pages/Wellness';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/assessment" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/wellness" element={
                <ProtectedRoute>
                  <Wellness />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
