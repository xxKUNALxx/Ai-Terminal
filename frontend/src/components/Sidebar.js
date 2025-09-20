import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ onClear, onOpenSettings, isCollapsed, onToggleCollapse, commandHistory, onCommandSelect, onDirectorySelect }) => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Common directories for quick navigation
  const commonDirectories = [
    { name: 'Home', path: '~', icon: '🏠', color: '#FF6B6B' },
    { name: 'Desktop', path: '~/Desktop', icon: '🖥️', color: '#4ECDC4' },
    { name: 'Documents', path: '~/Documents', icon: '📄', color: '#45B7D1' },
    { name: 'Downloads', path: '~/Downloads', icon: '⬇️', color: '#96CEB4' },
    { name: 'Pictures', path: '~/Pictures', icon: '🖼️', color: '#FFEAA7' },
    { name: 'Music', path: '~/Music', icon: '🎵', color: '#DDA0DD' },
    { name: 'Videos', path: '~/Videos', icon: '🎬', color: '#98D8C8' },
    { name: 'Projects', path: '~/Projects', icon: '💻', color: '#F7DC6F' },
    { name: 'Root', path: '/', icon: '📁', color: '#BB8FCE' }
  ];

  // Get recent commands (last 15)
  const recentCommands = commandHistory?.slice(-15).reverse() || [];

  // Group commands by category
  const commandCategories = {
    'git': recentCommands.filter(cmd => cmd.startsWith('git')),
    'npm': recentCommands.filter(cmd => cmd.startsWith('npm')),
    'docker': recentCommands.filter(cmd => cmd.startsWith('docker')),
    'ai': recentCommands.filter(cmd => cmd.startsWith('ai')),
    'system': recentCommands.filter(cmd => 
      ['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'find'].some(sysCmd => cmd.startsWith(sysCmd))
    ),
    'other': recentCommands.filter(cmd => 
      !cmd.startsWith('git') && 
      !cmd.startsWith('npm') && 
      !cmd.startsWith('docker') && 
      !cmd.startsWith('ai') &&
      !['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'find'].some(sysCmd => cmd.startsWith(sysCmd))
    )
  };

  const handleCommandClick = (command) => {
    if (onCommandSelect) {
      onCommandSelect(command);
    }
  };

  const handleDirectoryClick = (directory) => {
    if (onDirectorySelect) {
      onDirectorySelect(directory);
    }
  };

  const getCommandIcon = (command) => {
    if (command.startsWith('git')) return '🌿';
    if (command.startsWith('npm')) return '📦';
    if (command.startsWith('docker')) return '🐳';
    if (command.startsWith('ai')) return '🤖';
    if (['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'find'].some(cmd => command.startsWith(cmd))) return '💻';
    return '$';
  };

  const tabs = [
    { id: 'history', label: 'History', icon: '🕒', color: '#FF6B6B' },
    { id: 'directories', label: 'Folders', icon: '📁', color: '#4ECDC4' },
    { id: 'workflows', label: 'Workflows', icon: '⚡', color: '#45B7D1' }
  ];

  return (
    <motion.div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      initial={false}
      animate={{ width: isCollapsed ? 70 : 320 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ 
        background: `linear-gradient(135deg, ${themeColors.surface} 0%, ${themeColors.surface}dd 100%)`,
        borderRight: `1px solid ${themeColors.border}`,
        boxShadow: `0 0 30px ${themeColors.primary}15`,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header */}
      <div className="sidebar-header" style={{ 
        borderBottom: `1px solid ${themeColors.border}`,
        background: `linear-gradient(90deg, ${themeColors.primary}20, transparent)`
      }}>
        <div className="header-content">
          <motion.div
            className="logo-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="logo-icon" style={{ color: themeColors.primary }}>⚡</div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="logo-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="logo-title" style={{ color: themeColors.text }}>Terminal</div>
                  <div className="logo-subtitle" style={{ color: themeColors.textSecondary }}>AI Powered</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="header-actions">
            <motion.button
              className="settings-button"
              onClick={onOpenSettings}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})`,
                color: themeColors.surface,
                boxShadow: `0 4px 15px ${themeColors.primary}40`
              }}
              title="Settings"
            >
              ⚙️
            </motion.button>
            
            <motion.button
              className="collapse-button"
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                color: themeColors.textSecondary,
                background: themeColors.background + '40'
              }}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? '▶' : '◀'}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="sidebar-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            {/* Tab Navigation */}
            <div className="tab-navigation">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: activeTab === tab.id 
                      ? `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`
                      : 'transparent',
                    color: activeTab === tab.id ? tab.color : themeColors.textSecondary,
                    borderLeft: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent'
                  }}
                >
                  <span className="tab-icon" style={{ color: tab.color }}>{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div
                  className="history-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {recentCommands.length > 0 ? (
                    <div className="command-list">
                      {Object.entries(commandCategories).map(([category, commands]) => {
                        if (commands.length === 0) return null;
                        return (
                          <div key={category} className="command-category">
                            <div className="category-header" style={{ color: themeColors.textSecondary }}>
                              <span className="category-icon">{getCommandIcon(commands[0])}</span>
                              <span className="category-name">{category.toUpperCase()}</span>
                              <span className="category-count">{commands.length}</span>
                            </div>
                            <div className="command-items">
                              {commands.slice(0, 5).map((command, index) => (
                                <motion.div
                                  key={`${category}-${index}`}
                                  className="command-item"
                                  onClick={() => handleCommandClick(command)}
                                  whileHover={{ 
                                    scale: 1.02,
                                    x: 5,
                                    backgroundColor: themeColors.primary + '15'
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  style={{
                                    cursor: 'pointer',
                                    borderLeft: `2px solid ${themeColors.primary}40`
                                  }}
                                >
                                  <span className="command-text" style={{ color: themeColors.text }}>
                                    {command}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ color: themeColors.textSecondary }}>
                      <div className="empty-icon">📝</div>
                      <div className="empty-title">No commands yet</div>
                      <div className="empty-subtitle">Start typing to see history</div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Directories Tab */}
              {activeTab === 'directories' && (
                <motion.div
                  className="directories-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="directory-grid">
                    {commonDirectories.map((dir, index) => (
                      <motion.div
                        key={index}
                        className="directory-item"
                        onClick={() => handleDirectoryClick(dir.path)}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          boxShadow: `0 8px 25px ${dir.color}30`
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          cursor: 'pointer',
                          background: `linear-gradient(135deg, ${dir.color}15, ${dir.color}05)`,
                          border: `1px solid ${dir.color}30`
                        }}
                      >
                        <div className="directory-icon" style={{ color: dir.color }}>
                          {dir.icon}
                        </div>
                        <div className="directory-info">
                          <div className="directory-name" style={{ color: themeColors.text }}>
                            {dir.name}
                          </div>
                          <div className="directory-path" style={{ color: themeColors.textSecondary }}>
                            {dir.path}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="tips-section" style={{ 
                    background: `linear-gradient(135deg, ${themeColors.primary}10, transparent)`,
                    border: `1px solid ${themeColors.primary}20`
                  }}>
                    <div className="tips-icon" style={{ color: themeColors.primary }}>💡</div>
                    <div className="tips-content">
                      <div className="tips-title" style={{ color: themeColors.text }}>Quick Tips</div>
                      <div className="tips-text" style={{ color: themeColors.textSecondary }}>
                        Click any folder to navigate there instantly
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Workflows Tab */}
              {activeTab === 'workflows' && (
                <motion.div
                  className="workflows-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="empty-state" style={{ color: themeColors.textSecondary }}>
                    <div className="empty-icon">⚡</div>
                    <div className="empty-title">Workflows Coming Soon</div>
                    <div className="empty-subtitle">Automated command sequences</div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;