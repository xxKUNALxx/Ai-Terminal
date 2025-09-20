import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { currentTheme, changeTheme, getAvailableThemes, getThemeColors } = useTheme();
  const [activeTab, setActiveTab] = useState('themes');
  const [fontSize, setFontSize] = useState(14);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [autoComplete, setAutoComplete] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const themeColors = getThemeColors();
  const availableThemes = getAvailableThemes();

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.style.setProperty('--terminal-font-size', `${size}px`);
  };

  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    const speedMap = {
      slow: '0.5s',
      normal: '0.3s',
      fast: '0.1s'
    };
    document.documentElement.style.setProperty('--animation-duration', speedMap[speed]);
  };

  const tabs = [
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'display', label: 'Display', icon: '🖥️' },
    { id: 'behavior', label: 'Behavior', icon: '⚙️' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="settings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              boxShadow: `0 25px 50px ${themeColors.shadow}`
            }}
          >
            <div className="settings-header" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
              <h2 style={{ color: themeColors.text }}>Terminal Settings</h2>
              <button
                className="close-button"
                onClick={onClose}
                style={{ color: themeColors.textSecondary }}
              >
                ✕
              </button>
            </div>

            <div className="settings-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    color: activeTab === tab.id ? themeColors.primary : themeColors.textSecondary,
                    borderBottom: activeTab === tab.id ? `2px solid ${themeColors.primary}` : 'none'
                  }}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="settings-content">
              {activeTab === 'themes' && (
                <div className="themes-section">
                  <h3 style={{ color: themeColors.text }}>Choose Theme</h3>
                  <div className="themes-grid">
                    {availableThemes.map(theme => (
                      <motion.div
                        key={theme.key}
                        className={`theme-card ${currentTheme === theme.key ? 'selected' : ''}`}
                        onClick={() => handleThemeChange(theme.key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: theme.colors.background,
                          border: `2px solid ${currentTheme === theme.key ? theme.colors.primary : theme.colors.border}`,
                          boxShadow: currentTheme === theme.key ? `0 0 20px ${theme.colors.primary}40` : 'none'
                        }}
                      >
                        <div className="theme-preview">
                          <div className="preview-header" style={{ background: theme.colors.surface }}>
                            <div className="preview-dots">
                              <div style={{ background: theme.colors.error }}></div>
                              <div style={{ background: theme.colors.warning }}></div>
                              <div style={{ background: theme.colors.success }}></div>
                            </div>
                          </div>
                          <div className="preview-content" style={{ background: theme.colors.background }}>
                            <div className="preview-line" style={{ color: theme.colors.accent }}>
                              user@host:~$
                            </div>
                            <div className="preview-line" style={{ color: theme.colors.text }}>
                              echo "Hello World"
                            </div>
                          </div>
                        </div>
                        <div className="theme-name" style={{ color: theme.colors.text }}>
                          {theme.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'display' && (
                <div className="display-section">
                  <h3 style={{ color: themeColors.text }}>Display Settings</h3>
                  
                  <div className="setting-group">
                    <label style={{ color: themeColors.text }}>Font Size</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="10"
                        max="20"
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                        className="slider"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span style={{ color: themeColors.textSecondary }}>{fontSize}px</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label style={{ color: themeColors.text }}>Animation Speed</label>
                    <select
                      value={animationSpeed}
                      onChange={(e) => handleAnimationSpeedChange(e.target.value)}
                      style={{
                        background: themeColors.surface,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`
                      }}
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label className="checkbox-label" style={{ color: themeColors.text }}>
                      <input
                        type="checkbox"
                        checked={showTimestamps}
                        onChange={(e) => setShowTimestamps(e.target.checked)}
                        style={{ accentColor: themeColors.primary }}
                      />
                      Show timestamps
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'behavior' && (
                <div className="behavior-section">
                  <h3 style={{ color: themeColors.text }}>Behavior Settings</h3>
                  
                  <div className="setting-group">
                    <label className="checkbox-label" style={{ color: themeColors.text }}>
                      <input
                        type="checkbox"
                        checked={autoComplete}
                        onChange={(e) => setAutoComplete(e.target.checked)}
                        style={{ accentColor: themeColors.primary }}
                      />
                      Enable auto-completion
                    </label>
                  </div>

                  <div className="setting-group">
                    <label className="checkbox-label" style={{ color: themeColors.text }}>
                      <input
                        type="checkbox"
                        checked={soundEffects}
                        onChange={(e) => setSoundEffects(e.target.checked)}
                        style={{ accentColor: themeColors.primary }}
                      />
                      Sound effects
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="advanced-section">
                  <h3 style={{ color: themeColors.text }}>Advanced Settings</h3>
                  
                  <div className="setting-group">
                    <label style={{ color: themeColors.text }}>Command History Limit</label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      defaultValue="100"
                      style={{
                        background: themeColors.surface,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`,
                        padding: '8px 12px',
                        borderRadius: '6px'
                      }}
                    />
                  </div>

                  <div className="setting-group">
                    <label style={{ color: themeColors.text }}>API Timeout (seconds)</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      defaultValue="30"
                      style={{
                        background: themeColors.surface,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`,
                        padding: '8px 12px',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="settings-footer" style={{ borderTop: `1px solid ${themeColors.border}` }}>
              <button
                className="reset-button"
                onClick={() => {
                  setFontSize(14);
                  setAnimationSpeed('normal');
                  setShowTimestamps(true);
                  setAutoComplete(true);
                  setSoundEffects(false);
                  handleThemeChange('dark');
                }}
                style={{
                  background: themeColors.surface,
                  color: themeColors.text,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                Reset to Defaults
              </button>
              <button
                className="save-button"
                onClick={onClose}
                style={{
                  background: themeColors.primary,
                  color: '#ffffff'
                }}
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;

