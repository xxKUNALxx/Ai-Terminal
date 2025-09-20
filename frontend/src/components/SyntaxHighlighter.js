import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';
import './SyntaxHighlighter.css';

const SyntaxHighlighterComponent = ({ 
  code, 
  language = 'bash', 
  showLineNumbers = false,
  customStyle = {}
}) => {
  const { getThemeColors, currentTheme } = useTheme();
  const themeColors = getThemeColors();
  
  // Choose theme based on current theme
  const syntaxTheme = currentTheme === 'light' ? vs : vscDarkPlus;
  
  // Custom theme colors
  const customSyntaxTheme = {
    ...syntaxTheme,
    'code[class*="language-"]': {
      ...syntaxTheme['code[class*="language-"]'],
      background: 'transparent',
      color: themeColors.text
    },
    'pre[class*="language-"]': {
      ...syntaxTheme['pre[class*="language-"]'],
      background: 'transparent',
      color: themeColors.text,
      border: `1px solid ${themeColors.border}`,
      borderRadius: '8px',
      padding: '12px',
      margin: '8px 0'
    }
  };

  // Detect language from code content if not specified
  const detectLanguage = (code) => {
    if (language !== 'auto') return language;
    
    const codeLower = code.toLowerCase();
    
    if (codeLower.includes('npm') || codeLower.includes('yarn') || codeLower.includes('package.json')) {
      return 'json';
    }
    if (codeLower.includes('docker') || codeLower.includes('FROM') || codeLower.includes('RUN')) {
      return 'dockerfile';
    }
    if (codeLower.includes('git') || codeLower.includes('commit') || codeLower.includes('branch')) {
      return 'bash';
    }
    if (codeLower.includes('python') || codeLower.includes('def ') || codeLower.includes('import ')) {
      return 'python';
    }
    if (codeLower.includes('javascript') || codeLower.includes('function') || codeLower.includes('const ')) {
      return 'javascript';
    }
    if (codeLower.includes('html') || codeLower.includes('<div>') || codeLower.includes('<span>')) {
      return 'html';
    }
    if (codeLower.includes('css') || codeLower.includes('{') || codeLower.includes('}')) {
      return 'css';
    }
    if (codeLower.includes('sql') || codeLower.includes('SELECT') || codeLower.includes('FROM')) {
      return 'sql';
    }
    
    return 'bash';
  };

  const detectedLanguage = detectLanguage(code);

  return (
    <div className="syntax-highlighter-container">
      <SyntaxHighlighter
        language={detectedLanguage}
        style={customSyntaxTheme}
        showLineNumbers={showLineNumbers}
        customStyle={{
          background: 'transparent',
          padding: '0',
          margin: '0',
          fontSize: '13px',
          lineHeight: '1.4',
          ...customStyle
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px'
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Simple syntax highlighting for terminal output
export const highlightTerminalOutput = (text, themeColors) => {
  if (!text) return text;

  // Color patterns for different types of output
  const patterns = [
    // Error messages (red)
    {
      pattern: /(error|Error|ERROR|failed|Failed|FAILED|exception|Exception|EXCEPTION)/g,
      color: themeColors.error
    },
    // Success messages (green)
    {
      pattern: /(success|Success|SUCCESS|completed|Completed|COMPLETED|done|Done|DONE)/g,
      color: themeColors.success
    },
    // Warning messages (yellow)
    {
      pattern: /(warning|Warning|WARNING|warn|Warn|WARN|caution|Caution|CAUTION)/g,
      color: themeColors.warning
    },
    // File paths (blue)
    {
      pattern: /(\/[^\s]+|\.\/[^\s]+|~\/[^\s]+)/g,
      color: themeColors.primary
    },
    // Numbers (cyan)
    {
      pattern: /(\d+)/g,
      color: themeColors.accent
    },
    // URLs (purple)
    {
      pattern: /(https?:\/\/[^\s]+)/g,
      color: themeColors.secondary
    },
    // Commands (bold)
    {
      pattern: /^(\$|#|>)\s*(.+)$/gm,
      color: themeColors.accent,
      bold: true
    }
  ];

  let highlightedText = text;

  patterns.forEach(({ pattern, color, bold }) => {
    highlightedText = highlightedText.replace(pattern, (match) => {
      const style = `color: ${color};${bold ? ' font-weight: bold;' : ''}`;
      return `<span style="${style}">${match}</span>`;
    });
  });

  return highlightedText;
};

export default SyntaxHighlighterComponent;

