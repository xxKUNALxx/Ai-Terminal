import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './Terminal.css';
import Sidebar from './Sidebar';
import CommandInput from './CommandInput';
import OutputLine from './OutputLine';

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('~/Desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const terminalRef = useRef(null);

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
        content: 'Type commands or use natural language with "ai" prefix',
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
    setIsLoading(true);

    try {
      const response = await axios.post('/api/execute', {
        command: command.trim()
      });

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
    if (partial.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.post('/api/suggestions', {
        partial: partial
      });
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(response.data.suggestions?.length > 0);
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  return (
    <div className="terminal-container">
      <Sidebar onClear={clearTerminal} />
      
      <div className="terminal-main">
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control-button close"></div>
            <div className="control-button minimize"></div>
            <div className="control-button maximize"></div>
          </div>
          <div className="terminal-title">~/org/app +</div>
        </div>

        <div className="terminal-content" ref={terminalRef}>
          <AnimatePresence>
            {history.map((entry, index) => (
              <OutputLine 
                key={index} 
                entry={entry} 
                directory={entry.directory || currentDirectory}
              />
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              className="loading-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
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
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;