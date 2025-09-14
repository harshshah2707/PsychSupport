import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update CSS custom properties
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--primary', '#6366f1');
      root.style.setProperty('--secondary', '#10b981');
      root.style.setProperty('--danger', '#ef4444');
      root.style.setProperty('--text', '#f9fafb');
      root.style.setProperty('--muted', '#9ca3af');
      root.style.setProperty('--bg', '#111827');
      root.style.setProperty('--card', '#1f2937');
      root.style.setProperty('--border', '#374151');
    } else {
      root.style.setProperty('--primary', '#4f46e5');
      root.style.setProperty('--secondary', '#16a34a');
      root.style.setProperty('--danger', '#dc2626');
      root.style.setProperty('--text', '#111827');
      root.style.setProperty('--muted', '#6b7280');
      root.style.setProperty('--bg', '#f9fafb');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--border', '#e5e7eb');
    }
    
    // Update body class for additional styling
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
