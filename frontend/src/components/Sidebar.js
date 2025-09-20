import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ onClear }) => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);

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

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Warp Drive</h2>
        <div className="sidebar-controls">
          <span className="team-selector">Warp team ⌄</span>
          <div className="header-icons">
            <span className="icon">👤</span>
            <span className="icon">+</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <span className="folder-icon">📁</span>
          <span>Starter workflows</span>
          <span className="expand-icon">⌄</span>
        </div>
        
        <div className="workflow-list">
          {workflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              className={`workflow-item ${activeWorkflow === workflow.id ? 'active' : ''}`}
              onClick={() => setActiveWorkflow(workflow.id)}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="workflow-icon">{workflow.icon}</span>
              <span className="workflow-name">{workflow.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <span className="folder-icon">📁</span>
          <span>Rich-text Notebooks</span>
          <span className="expand-icon">⌄</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
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
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="workflow-icon">{notebook.icon}</span>
              <span className="workflow-name">{notebook.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <motion.button
          className="clear-button"
          onClick={onClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Terminal
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;