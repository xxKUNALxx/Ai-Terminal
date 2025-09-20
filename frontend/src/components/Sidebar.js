import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ onClear, onOpenSettings, isCollapsed, onToggleCollapse, commandHistory, onCommandSelect, onDirectorySelect }) => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Common directories for quick navigation
  const commonDirectories = [
    { name: 'Home', path: '~', icon: '🏠' },
    { name: 'Desktop', path: '~/Desktop', icon: '🖥️' },
    { name: 'Documents', path: '~/Documents', icon: '📄' },
    { name: 'Downloads', path: '~/Downloads', icon: '⬇️' },
    { name: 'Pictures', path: '~/Pictures', icon: '🖼️' },
    { name: 'Music', path: '~/Music', icon: '🎵' },
    { name: 'Videos', path: '~/Videos', icon: '🎬' },
    { name: 'Projects', path: '~/Projects', icon: '💻' },
    { name: 'Root', path: '/', icon: '📁' }
  ];

  const workflows = [
    { id: 1, name: 'Decode hex encoded...', icon: '$' },
    { id: 2, name: 'Reveal a bug if you have...', icon: '$' },
    { id: 3, name: 'Add Subshell RC file hoo...', icon: '$' },
    { id: 4, name: 'Rebase on main branch', icon: '$' },
    { id: 5, name: 'Rebase on main branch', icon: '$' }
  ];

  const notebooks = [
    { id: 1, name: 'Graphite cheat sheet', icon: '📄' },
    { id: 2, name: 'Convert certificate from...', icon: '$' },
    { id: 3, name: 'Check website certificate', icon: '$' },
    { id: 4, name: 'Export public key from...', icon: '$' },
    { id: 5, name: 'Change an SSH key...', icon: '$' },
    { id: 6, name: 'Debug blocklist madness', icon: '📄' }
  ];

  // Get recent commands (last 20)
  const recentCommands = commandHistory?.slice(-20).reverse() || [];

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

  return (
    <motion.div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      initial={false}
      animate={{ width: isCollapsed ? '60px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ background: themeColors.surface }}
    >
      <div className="sidebar-header" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
        {!isCollapsed && (
          <>
            <h2 className="sidebar-title" style={{ color: themeColors.text }}>Warp Drive</h2>
            <div className="sidebar-controls">
              <span className="team-selector" style={{ color: themeColors.textSecondary }}>Warp team ⌄</span>
              <div className="header-icons">
                <motion.span 
                  className="icon" 
                  whileHover={{ scale: 1.1 }}
                  style={{ color: themeColors.textSecondary }}
                >
                  👤
                </motion.span>
                <motion.span 
                  className="icon" 
                  whileHover={{ scale: 1.1 }}
                  style={{ color: themeColors.textSecondary }}
                >
                  +
                </motion.span>
              </div>
            </div>
          </>
        )}
        <motion.button
          className="collapse-button"
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ color: themeColors.textSecondary }}
        >
          {isCollapsed ? '→' : '←'}
        </motion.button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tab Navigation */}
          <div className="sidebar-tabs" style={{ borderBottom: `1px solid ${themeColors.border}` }}>
            <motion.button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              whileHover={{ backgroundColor: themeColors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
              style={{
                color: activeTab === 'history' ? themeColors.primary : themeColors.textSecondary,
                borderBottom: activeTab === 'history' ? `2px solid ${themeColors.primary}` : '2px solid transparent'
              }}
            >
              <span className="tab-icon">🕒</span>
              History
            </motion.button>
            <motion.button
              className={`tab-button ${activeTab === 'directories' ? 'active' : ''}`}
              onClick={() => setActiveTab('directories')}
              whileHover={{ backgroundColor: themeColors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
              style={{
                color: activeTab === 'directories' ? themeColors.primary : themeColors.textSecondary,
                borderBottom: activeTab === 'directories' ? `2px solid ${themeColors.primary}` : '2px solid transparent'
              }}
            >
              <span className="tab-icon">📁</span>
              Directories
            </motion.button>
            <motion.button
              className={`tab-button ${activeTab === 'workflows' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflows')}
              whileHover={{ backgroundColor: themeColors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
              style={{
                color: activeTab === 'workflows' ? themeColors.primary : themeColors.textSecondary,
                borderBottom: activeTab === 'workflows' ? `2px solid ${themeColors.primary}` : '2px solid transparent'
              }}
            >
              <span className="tab-icon">⚡</span>
              Workflows
            </motion.button>
          </div>

          {/* Command History Tab */}
          {activeTab === 'history' && (
            <div className="sidebar-content">
              {recentCommands.length > 0 ? (
                Object.entries(commandCategories).map(([category, commands]) => {
                  if (commands.length === 0) return null;
                  
                  return (
                    <div key={category} className="sidebar-section">
                      <div className="section-header" style={{ color: themeColors.textSecondary }}>
                        <span className="folder-icon">
                          {category === 'git' ? '🌿' : 
                           category === 'npm' ? '📦' : 
                           category === 'docker' ? '🐳' : 
                           category === 'ai' ? '🤖' : 
                           category === 'system' ? '💻' : '📝'}
                        </span>
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)} Commands</span>
                        <span className="command-count" style={{ color: themeColors.accent }}>
                          {commands.length}
                        </span>
                      </div>
                      
                      <div className="workflow-list">
                        {commands.slice(0, 5).map((command, index) => (
                          <motion.div
                            key={`${category}-${index}`}
                            className="workflow-item command-item"
                            onClick={() => handleCommandClick(command)}
                            whileHover={{ backgroundColor: themeColors.primary + '20' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              cursor: 'pointer',
                              borderLeft: `3px solid ${themeColors.accent}`
                            }}
                          >
                            <span className="workflow-icon" style={{ color: themeColors.accent }}>
                              {getCommandIcon(command)}
                            </span>
                            <span 
                              className="workflow-name command-text" 
                              style={{ color: themeColors.text }}
                              title={command}
                            >
                              {command.length > 30 ? command.substring(0, 30) + '...' : command}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state" style={{ color: themeColors.textSecondary, textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕒</div>
                  <div>No commands yet</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Start typing to see history</div>
                </div>
              )}
            </div>
          )}

          {/* Directories Tab */}
          {activeTab === 'directories' && (
            <div className="sidebar-content">
              <div className="sidebar-section">
                <div className="section-header" style={{ color: themeColors.textSecondary }}>
                  <span className="folder-icon">📁</span>
                  <span>Quick Navigation</span>
                </div>
                
                <div className="workflow-list">
                  {commonDirectories.map((dir, index) => (
                    <motion.div
                      key={index}
                      className="workflow-item directory-item"
                      onClick={() => handleDirectoryClick(dir.path)}
                      whileHover={{ backgroundColor: themeColors.primary + '20' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        cursor: 'pointer',
                        borderLeft: `3px solid ${themeColors.accent}`
                      }}
                    >
                      <span className="workflow-icon" style={{ color: themeColors.accent }}>
                        {dir.icon}
                      </span>
                      <span 
                        className="workflow-name directory-text" 
                        style={{ color: themeColors.text }}
                        title={dir.path}
                      >
                        {dir.name}
                      </span>
                      <span 
                        className="directory-path" 
                        style={{ color: themeColors.textSecondary, fontSize: '10px' }}
                      >
                        {dir.path}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header" style={{ color: themeColors.textSecondary }}>
                  <span className="folder-icon">💡</span>
                  <span>Tips</span>
                </div>
                <div className="tips-content" style={{ color: themeColors.textSecondary, fontSize: '11px', padding: '8px 16px' }}>
                  • Click any directory to navigate there<br/>
                  • Use "cd" command for custom paths<br/>
                  • "~" represents your home directory
                </div>
              </div>
            </div>
          )}

          {/* Workflows Tab */}
          {activeTab === 'workflows' && (
            <div className="sidebar-content">
              <div className="sidebar-section">
                <div className="section-header" style={{ color: themeColors.textSecondary }}>
                  <span className="folder-icon">⚡</span>
                  <span>Starter workflows</span>
                  <span className="expand-icon">⌄</span>
                </div>
                
                <div className="workflow-list">
                  {workflows.map((workflow) => (
                    <motion.div
                      key={workflow.id}
                      className={`workflow-item ${activeWorkflow === workflow.id ? 'active' : ''}`}
                      onClick={() => setActiveWorkflow(workflow.id)}
                      whileHover={{ backgroundColor: themeColors.primary + '20' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: activeWorkflow === workflow.id ? themeColors.primary + '30' : 'transparent',
                        borderLeft: activeWorkflow === workflow.id ? `3px solid ${themeColors.primary}` : '3px solid transparent'
                      }}
                    >
                      <span className="workflow-icon" style={{ color: themeColors.accent }}>{workflow.icon}</span>
                      <span className="workflow-name" style={{ color: themeColors.text }}>{workflow.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header" style={{ color: themeColors.textSecondary }}>
                  <span className="folder-icon">📁</span>
                  <span>Rich-text Notebooks</span>
                  <span className="expand-icon">⌄</span>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header" style={{ color: themeColors.textSecondary }}>
                  <span className="user-icon">👤</span>
                  <span>Rob Jones</span>
                  <span className="expand-icon">⌄</span>
                  <span className="add-icon">+</span>
                </div>
                
                <div className="workflow-list">
                  {notebooks.map((notebook) => (
                    <motion.div
                      key={notebook.id}
                      className="workflow-item"
                      whileHover={{ backgroundColor: themeColors.primary + '20' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="workflow-icon" style={{ color: themeColors.accent }}>{notebook.icon}</span>
                      <span className="workflow-name" style={{ color: themeColors.text }}>{notebook.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="sidebar-footer" style={{ borderTop: `1px solid ${themeColors.border}` }}>
        <motion.button
          className="clear-button"
          onClick={onClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: themeColors.surface,
            color: themeColors.text,
            border: `1px solid ${themeColors.border}`
          }}
        >
          {isCollapsed ? '🗑️' : 'Clear Terminal'}
        </motion.button>
        
        <motion.button
          className="settings-button"
          onClick={onOpenSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: themeColors.primary,
            color: '#ffffff'
          }}
        >
          {isCollapsed ? '⚙️' : 'Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;