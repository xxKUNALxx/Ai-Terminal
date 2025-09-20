import React from 'react';
import Terminal from './components/Terminal';
import AnimatedBackground from './components/AnimatedBackground';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <AnimatedBackground />
        <Terminal />
      </div>
    </ThemeProvider>
  );
}

export default App;