import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  dark: {
    name: 'Dark Terminal',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: 'rgba(0, 0, 0, 0.8)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#4ecdc4',
      error: '#ff6b6b',
      success: '#51cf66',
      warning: '#ffd43b',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  light: {
    name: 'Light Terminal',
    colors: {
      primary: '#4c6ef5',
      secondary: '#9775fa',
      background: 'rgba(255, 255, 255, 0.9)',
      surface: 'rgba(0, 0, 0, 0.05)',
      text: '#2c3e50',
      textSecondary: 'rgba(44, 62, 80, 0.7)',
      accent: '#20c997',
      error: '#e74c3c',
      success: '#27ae60',
      warning: '#f39c12',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #4c6ef5 0%, #9775fa 100%)'
    }
  },
  neon: {
    name: 'Neon Cyber',
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      background: 'rgba(0, 0, 0, 0.95)',
      surface: 'rgba(0, 255, 136, 0.1)',
      text: '#00ff88',
      textSecondary: 'rgba(0, 255, 136, 0.7)',
      accent: '#ff0080',
      error: '#ff0040',
      success: '#00ff88',
      warning: '#ffff00',
      border: 'rgba(0, 255, 136, 0.3)',
      shadow: 'rgba(0, 255, 136, 0.2)',
      gradient: 'linear-gradient(135deg, #00ff88 0%, #ff0080 100%)'
    }
  },
  matrix: {
    name: 'Matrix Green',
    colors: {
      primary: '#00ff00',
      secondary: '#008f11',
      background: 'rgba(0, 0, 0, 0.9)',
      surface: 'rgba(0, 255, 0, 0.05)',
      text: '#00ff00',
      textSecondary: 'rgba(0, 255, 0, 0.7)',
      accent: '#00ff00',
      error: '#ff0000',
      success: '#00ff00',
      warning: '#ffff00',
      border: 'rgba(0, 255, 0, 0.2)',
      shadow: 'rgba(0, 255, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #00ff00 0%, #008f11 100%)'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0077be',
      secondary: '#00a8cc',
      background: 'rgba(0, 0, 0, 0.85)',
      surface: 'rgba(0, 119, 190, 0.1)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#00d4ff',
      error: '#ff4757',
      success: '#2ed573',
      warning: '#ffa502',
      border: 'rgba(0, 119, 190, 0.3)',
      shadow: 'rgba(0, 119, 190, 0.2)',
      gradient: 'linear-gradient(135deg, #0077be 0%, #00a8cc 100%)'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('terminal-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName] && themeName !== currentTheme) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTheme(themeName);
        setIsAnimating(false);
      }, 300);
    }
  };

  const getThemeColors = () => themes[currentTheme].colors;
  const getThemeName = () => themes[currentTheme].name;
  const getAvailableThemes = () => Object.keys(themes).map(key => ({
    key,
    name: themes[key].name,
    colors: themes[key].colors
  }));

  const value = {
    currentTheme,
    changeTheme,
    getThemeColors,
    getThemeName,
    getAvailableThemes,
    isAnimating
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

