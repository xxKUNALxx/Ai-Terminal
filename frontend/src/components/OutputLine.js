import React from 'react';
import { motion } from 'framer-motion';
import './OutputLine.css';

const OutputLine = ({ entry, directory }) => {
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

  const renderContent = () => {
    if (!entry.content) return null;

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
          <span className="command-prompt">{getPrompt(directory)}</span>
          <span className="command-text">{entry.content}</span>
          <span className="command-timestamp">{formatTimestamp(entry.timestamp)}</span>
        </div>
      )}
      
      {entry.type !== 'command' && (
        <div className="output-display">
          {entry.type === 'system' && (
            <span className="system-prefix">ℹ️</span>
          )}
          {entry.type === 'error' && (
            <span className="error-prefix">❌</span>
          )}
          <div className="output-content">
            {renderContent()}
          </div>
          <span className="output-timestamp">{formatTimestamp(entry.timestamp)}</span>
        </div>
      )}
    </motion.div>
  );
};

export default OutputLine;