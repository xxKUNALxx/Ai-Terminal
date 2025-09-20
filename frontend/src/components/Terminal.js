import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './Terminal.css';
import Sidebar from './Sidebar';
import CommandInput from './CommandInput';
import OutputLine from './OutputLine';
import SettingsPanel from './SettingsPanel';
import KeyboardShortcuts from './KeyboardShortcuts';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { getSuggestions as getCommandSuggestions } from '../utils/commandRegistry';

const TerminalContent = () => {
  const [history, setHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const terminalRef = useRef(null);
  const { getThemeColors, isAnimating } = useTheme();
  const themeColors = getThemeColors();

  useEffect(() => {
    // Initial welcome message
    setHistory([
      {
        type: 'system',
        content: 'Welcome to AI Terminal Emulator',
        timestamp: new Date()
      },
      {
        type: 'system', 
        content: 'Type commands or natural language queries (e.g., "create a new folder", "show me the files")',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl + , for settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }

      // Ctrl + B for sidebar toggle
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }

      // Ctrl + L for clear terminal
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearTerminal();
      }

      // F1 for shortcuts help
      if (e.key === 'F1') {
        e.preventDefault();
        setShowShortcuts(true);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed]);

  const executeCommand = async (command) => {
    if (!command.trim()) return;

    // Add command to history
    const commandEntry = {
      type: 'command',
      content: command,
      directory: currentDirectory,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, commandEntry]);
    
    // Add to command history for sidebar
    setCommandHistory(prev => [...prev, command]);
    
    setIsLoading(true);

    try {
      const response = await axios.post('/api/execute', {
        command: command.trim()
      });

      // Handle natural language interpretation
      if (response.data.is_natural_language && response.data.interpretation) {
        const interpretationEntry = {
          type: 'system',
          content: response.data.interpretation,
          timestamp: new Date()
        };
        setHistory(prev => [...prev, interpretationEntry]);
      }

      const outputEntry = {
        type: response.data.exit_code === 0 ? 'output' : 'error',
        content: response.data.output,
        timestamp: new Date()
      };

      setHistory(prev => [...prev, outputEntry]);
      
      if (response.data.directory) {
        setCurrentDirectory(response.data.directory);
      }

    } catch (error) {
      const errorEntry = {
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorEntry]);
    }

    setIsLoading(false);
  };

  const getSuggestions = async (partial) => {
    if (partial.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Get local command suggestions first
    const localSuggestions = getCommandSuggestions(partial, 5);
    
    // Try to get AI suggestions for natural language
    try {
      const response = await axios.post('/api/suggestions', {
        partial: partial
      });
      const aiSuggestions = response.data.suggestions || [];
      
      // Combine local and AI suggestions, removing duplicates
      const allSuggestions = [...new Set([...localSuggestions.map(s => s.command), ...aiSuggestions])];
      setSuggestions(allSuggestions.slice(0, 10));
      setShowSuggestions(allSuggestions.length > 0);
    } catch (error) {
      // If AI suggestions fail, use local suggestions
      if (localSuggestions.length > 0) {
        const suggestionStrings = localSuggestions.map(s => s.command);
        setSuggestions(suggestionStrings);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const clearTerminal = () => {
    setHistory([]);
    setCommandHistory([]);
  };

  const handleCommandSelect = (command) => {
    setSelectedCommand(command);
    // Clear the selected command after a short delay to allow re-selection
    setTimeout(() => setSelectedCommand(null), 100);
  };

  const handleDirectorySelect = (directory) => {
    // Execute cd command to change directory
    executeCommand(`cd ${directory}`);
  };

  return (
    <div 
      className="terminal-container"
      style={{
        background: themeColors.gradient,
        opacity: isAnimating ? 0.8 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <Sidebar 
        onClear={clearTerminal}
        onOpenSettings={() => setShowSettings(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        commandHistory={commandHistory}
        onCommandSelect={handleCommandSelect}
        onDirectorySelect={handleDirectorySelect}
      />
      
      <div 
        className="terminal-main"
        style={{
          background: themeColors.background,
          border: `1px solid ${themeColors.border}`
        }}
      >
        <div 
          className="terminal-header"
          style={{
            background: themeColors.surface,
            borderBottom: `1px solid ${themeColors.border}`
          }}
        >
          <div className="terminal-controls">
            <motion.div 
              className="control-button close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ background: themeColors.error }}
            ></motion.div>
            <motion.div 
              className="control-button minimize"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ background: themeColors.warning }}
            ></motion.div>
            <motion.div 
              className="control-button maximize"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ background: themeColors.success }}
            ></motion.div>
          </div>
          <div 
            className="terminal-title"
            style={{ color: themeColors.textSecondary }}
          >
            {currentDirectory} +
          </div>
        </div>

        <div 
          className="terminal-content" 
          ref={terminalRef}
          style={{ color: themeColors.text }}
        >
          <AnimatePresence>
            {history.map((entry, index) => (
              <OutputLine 
                key={index} 
                entry={entry} 
                directory={entry.directory || currentDirectory}
                themeColors={themeColors}
              />
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              className="loading-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: themeColors.accent }}
            >
              <div className="loading-dots">
                <span style={{ background: themeColors.accent }}></span>
                <span style={{ background: themeColors.accent }}></span>
                <span style={{ background: themeColors.accent }}></span>
              </div>
            </motion.div>
          )}

          <CommandInput
            onExecute={executeCommand}
            onSuggestionRequest={getSuggestions}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            currentDirectory={currentDirectory}
            isLoading={isLoading}
            themeColors={themeColors}
            selectedCommand={selectedCommand}
          />
        </div>
      </div>

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <KeyboardShortcuts 
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

const Terminal = () => {
  return <TerminalContent />;
};

export default Terminal;