import React from 'react';
import { motion } from 'framer-motion';
import SyntaxHighlighterComponent, { highlightTerminalOutput } from './SyntaxHighlighter';
import './OutputLine.css';

const OutputLine = ({ entry, directory, themeColors }) => {
  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPrompt = (dir) => {
    const user = 'user';
    const host = 'localhost';
    const dirName = dir?.split('/').pop() || dir || '~';
    return `${user}@${host}:${dirName}$`;
  };

  const defaultThemeColors = {
    primary: '#667eea',
    accent: '#4ecdc4',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    error: '#ff6b6b',
    success: '#51cf66',
    warning: '#ffd43b'
  };

  const colors = themeColors || defaultThemeColors;

  const renderContent = () => {
    if (!entry.content) return null;

    // Check if content looks like code (has multiple lines or specific patterns)
    const isCode = entry.content.includes('\n') || 
                   entry.content.includes('{') || 
                   entry.content.includes('function') ||
                   entry.content.includes('import') ||
                   entry.content.includes('def ') ||
                   entry.content.includes('class ') ||
                   entry.content.includes('SELECT') ||
                   entry.content.includes('FROM');

    if (isCode && entry.type === 'output') {
      return (
        <SyntaxHighlighterComponent
          code={entry.content}
          language="auto"
          showLineNumbers={entry.content.split('\n').length > 5}
        />
      );
    }

    // For regular output, apply basic highlighting
    const highlightedContent = highlightTerminalOutput(entry.content, colors);
    
    if (highlightedContent !== entry.content) {
      return (
        <div 
          className="output-line-content"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      );
    }

    // Split content into lines for better formatting
    const lines = entry.content.split('\n');
    
    return lines.map((line, index) => (
      <div key={index} className="output-line-content">
        {line}
      </div>
    ));
  };

  const getLineClass = () => {
    switch (entry.type) {
      case 'command':
        return 'output-line command-line';
      case 'output':
        return 'output-line output-line-normal';
      case 'error':
        return 'output-line output-line-error';
      case 'system':
        return 'output-line output-line-system';
      default:
        return 'output-line';
    }
  };

  return (
    <motion.div
      className={getLineClass()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {entry.type === 'command' && (
        <div className="command-display">
          <span 
            className="command-prompt"
            style={{ color: colors.accent }}
          >
            {getPrompt(directory)}
          </span>
          <span 
            className="command-text"
            style={{ color: colors.text }}
          >
            {entry.content}
          </span>
          <span 
            className="command-timestamp"
            style={{ color: colors.textSecondary }}
          >
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
      )}
      
      {entry.type !== 'command' && (
        <div className="output-display">
          {entry.type === 'system' && (
            <span className="system-prefix" style={{ color: colors.primary }}>ℹ️</span>
          )}
          {entry.type === 'error' && (
            <span className="error-prefix" style={{ color: colors.error }}>❌</span>
          )}
          <div 
            className="output-content"
            style={{ 
              color: entry.type === 'error' ? colors.error : 
                     entry.type === 'system' ? colors.primary : colors.text 
            }}
          >
            {renderContent()}
          </div>
          <span 
            className="output-timestamp"
            style={{ color: colors.textSecondary }}
          >
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default OutputLine;