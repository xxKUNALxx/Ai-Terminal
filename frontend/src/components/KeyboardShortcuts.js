import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './KeyboardShortcuts.css';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const shortcuts = [
    {
      category: 'Terminal',
      shortcuts: [
        { key: 'Ctrl + C', description: 'Interrupt current command' },
        { key: 'Ctrl + L', description: 'Clear terminal' },
        { key: 'Ctrl + D', description: 'Exit terminal' },
        { key: '↑ / ↓', description: 'Navigate command history' },
        { key: 'Tab', description: 'Auto-complete command' },
        { key: 'Ctrl + R', description: 'Search command history' }
      ]
    },
    {
      category: 'Navigation',
      shortcuts: [
        { key: 'Ctrl + ← / →', description: 'Jump between words' },
        { key: 'Home / End', description: 'Jump to start/end of line' },
        { key: 'Ctrl + A', description: 'Select all text' },
        { key: 'Ctrl + K', description: 'Clear from cursor to end' },
        { key: 'Ctrl + U', description: 'Clear from cursor to start' }
      ]
    },
    {
      category: 'Interface',
      shortcuts: [
        { key: 'Ctrl + ,', description: 'Open settings' },
        { key: 'Ctrl + B', description: 'Toggle sidebar' },
        { key: 'Ctrl + T', description: 'New terminal tab' },
        { key: 'Ctrl + W', description: 'Close current tab' },
        { key: 'F11', description: 'Toggle fullscreen' },
        { key: 'Ctrl + Shift + C', description: 'Copy selected text' },
        { key: 'Ctrl + Shift + V', description: 'Paste text' }
      ]
    },
    {
      category: 'AI Commands',
      shortcuts: [
        { key: 'ai + Space', description: 'Start AI command' },
        { key: 'ai help', description: 'Show AI help' },
        { key: 'ai explain', description: 'Explain command or concept' },
        { key: 'ai generate', description: 'Generate code or content' },
        { key: 'ai debug', description: 'Debug code or error' }
      ]
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="shortcuts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="shortcuts-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              boxShadow: `0 25px 50px ${themeColors.shadow}`
            }}
          >
            <div 
              className="shortcuts-header"
              style={{ borderBottom: `1px solid ${themeColors.border}` }}
            >
              <h2 style={{ color: themeColors.text }}>Keyboard Shortcuts</h2>
              <button
                className="close-button"
                onClick={onClose}
                style={{ color: themeColors.textSecondary }}
              >
                ✕
              </button>
            </div>

            <div className="shortcuts-content">
              {shortcuts.map((category, categoryIndex) => (
                <div key={categoryIndex} className="shortcut-category">
                  <h3 
                    className="category-title"
                    style={{ color: themeColors.primary }}
                  >
                    {category.category}
                  </h3>
                  <div className="shortcuts-list">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <motion.div
                        key={shortcutIndex}
                        className="shortcut-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.1 + shortcutIndex * 0.05 }}
                        style={{
                          borderBottom: `1px solid ${themeColors.border}20`
                        }}
                      >
                        <div 
                          className="shortcut-key"
                          style={{
                            background: themeColors.surface,
                            color: themeColors.text,
                            border: `1px solid ${themeColors.border}`
                          }}
                        >
                          {shortcut.key}
                        </div>
                        <div 
                          className="shortcut-description"
                          style={{ color: themeColors.textSecondary }}
                        >
                          {shortcut.description}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="shortcuts-footer"
              style={{ borderTop: `1px solid ${themeColors.border}` }}
            >
              <p style={{ color: themeColors.textSecondary, fontSize: '12px' }}>
                Press <kbd style={{ 
                  background: themeColors.surface, 
                  color: themeColors.text,
                  border: `1px solid ${themeColors.border}`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;

