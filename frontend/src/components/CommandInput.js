import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CommandInput.css';

const CommandInput = ({ 
  onExecute, 
  onSuggestionRequest, 
  suggestions, 
  showSuggestions, 
  setShowSuggestions,
  currentDirectory,
  isLoading,
  themeColors,
  selectedCommand
}) => {
  const [input, setInput] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Handle command selection from sidebar
  useEffect(() => {
    if (selectedCommand) {
      setInput(selectedCommand);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  }, [selectedCommand]);

  useEffect(() => {
    // Request suggestions when input changes
    if (input.trim()) {
      const timeoutId = setTimeout(() => {
        onSuggestionRequest(input);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
    }
  }, [input, onSuggestionRequest, setShowSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add to command history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    onExecute(input);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setInput(suggestions[selectedSuggestion]);
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else {
      // Command history navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex + 1;
          if (newIndex < commandHistory.length) {
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex]);
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getPrompt = () => {
    const user = 'user';
    const host = 'localhost';
    const dir = currentDirectory.split('/').pop() || currentDirectory;
    return `${user}@${host}:${dir}$`;
  };

  const defaultThemeColors = {
    primary: '#667eea',
    accent: '#4ecdc4',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    surface: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)'
  };

  const colors = themeColors || defaultThemeColors;

  return (
    <div className="command-input-container">
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="suggestions-popup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 10px 30px ${colors.shadow}`
            }}
          >
            <div 
              className="suggestions-header"
              style={{ 
                borderBottom: `1px solid ${colors.border}`,
                background: colors.primary + '10'
              }}
            >
              <span style={{ color: colors.primary }}>AI Suggestions</span>
              <span className="suggestions-hint" style={{ color: colors.textSecondary }}>
                Tab to complete • ↑↓ to navigate
              </span>
            </div>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: colors.primary + '20' }}
                  style={{
                    backgroundColor: index === selectedSuggestion ? colors.primary + '30' : 'transparent',
                    borderLeft: index === selectedSuggestion ? `3px solid ${colors.primary}` : '3px solid transparent'
                  }}
                >
                  <span className="suggestion-icon">💡</span>
                  <span className="suggestion-text" style={{ color: colors.text }}>{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="command-form">
        <div className="prompt-line">
          <span 
            className="prompt"
            style={{ color: colors.accent }}
          >
            {getPrompt()}
          </span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="command-input"
              placeholder={isLoading ? "Processing..." : "Type a command or natural language query"}
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              style={{
                color: colors.text,
                caretColor: colors.primary
              }}
            />
            <div className="typing-indicator">
              {input && (
                <motion.div
                  className="cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ background: colors.primary }}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommandInput;