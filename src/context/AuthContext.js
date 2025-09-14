import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('psychsupport_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('psychsupport_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a login
      const mockUser = {
        id: 1,
        name: 'Demo User',
        email: email,
        preferences: {
          notifications: true,
          reminderFrequency: 'daily',
          privacyLevel: 'private'
        },
        joinedDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('psychsupport_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const signup = async (name, email, password) => {
    try {
      // In a real app, this would make an API call
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        preferences: {
          notifications: true,
          reminderFrequency: 'daily',
          privacyLevel: 'private'
        },
        joinedDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('psychsupport_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('psychsupport_user');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('psychsupport_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
