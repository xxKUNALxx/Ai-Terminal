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
  isLoading 
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
          >
            <div className="suggestions-header">
              <span>AI Suggestions</span>
              <span className="suggestions-hint">Tab to complete • ↑↓ to navigate</span>
            </div>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.2)' }}
                >
                  <span className="suggestion-icon">💡</span>
                  <span className="suggestion-text">{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="command-form">
        <div className="prompt-line">
          <span className="prompt">{getPrompt()}</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="command-input"
              placeholder={isLoading ? "Processing..." : "Type a command or 'ai <natural language>'"}
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="typing-indicator">
              {input && (
                <motion.div
                  className="cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
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