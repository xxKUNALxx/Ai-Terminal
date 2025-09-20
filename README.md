# 🚀 AI Terminal Emulator

A modern, AI-powered terminal emulator with a beautiful React frontend and Python backend. Features natural language command interpretation using Google Gemini AI, inspired by Warp terminal's design.

![AI Terminal Demo](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

### 🎨 Modern UI
- **Glassmorphism Design**: Beautiful translucent interface with blur effects
- **Warp-Inspired**: Sidebar navigation with workflows and notebooks
- **Responsive**: Works perfectly on desktop and mobile devices
- **Smooth Animations**: Framer Motion powered interactions
- **JetBrains Mono**: Professional monospace typography

### 🤖 AI-Powered Commands
- **Natural Language Processing**: Convert phrases to terminal commands
  ```bash
  ai create a new file called test.txt     → touch test.txt
  ai show me all files in this directory   → ls -la
  ai delete the file old_data.txt          → rm old_data.txt
  ai go to the home directory              → cd ~
  ```
- **Smart Suggestions**: AI-powered command completion as you type
- **Fallback Support**: Works with or without AI API key using regex patterns

### 💻 Full Terminal Functionality
- **File Operations**: ls, cd, pwd, mkdir, rm, cp, mv, cat, touch
- **System Monitoring**: ps, top, df with real-time system information
- **Command History**: Navigate with arrow keys, persistent across sessions
- **Auto-completion**: Tab completion for commands and file paths
- **Error Handling**: User-friendly error messages with color coding

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  Google Gemini  │
│                 │    │                  │    │       AI        │
│  • Terminal UI  │◄──►│  • Command Exec  │◄──►│  • NLP Engine   │
│  • Suggestions  │    │  • AI Integration│    │  • Smart Parse  │
│  • Animations   │    │  • System Monitor│    │  • Suggestions  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-terminal-emulator.git
cd ai-terminal-emulator
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Optional: AI Setup
```bash
# Get API key from https://makersuite.google.com/app/apikey
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here
```

### 5. Start the Application
```bash
# Terminal 1: Backend
./start_backend.sh

# Terminal 2: Frontend
./start_frontend.sh
```

Open http://localhost:3000 in your browser! 🎉

## 📱 Usage Examples

### Regular Terminal Commands
```bash
pwd                    # Show current directory
ls -la                 # List files with details
mkdir projects         # Create directory
touch README.md        # Create file
cat package.json       # View file contents
ps                     # Show running processes
top                    # System resource usage
```

### AI Natural Language Commands
```bash
ai create a folder called "My Projects"
ai show me the contents of package.json
ai list all Python files in this directory
ai copy README.md to backup.md
ai find files containing "react"
ai show system information
ai clear the terminal screen
```

### Smart Features
- **Auto-suggestions**: Start typing and see AI-powered completions
- **Command history**: Use ↑/↓ arrows to navigate previous commands
- **Tab completion**: Press Tab to complete commands and file paths
- **Error recovery**: Friendly error messages with suggestions

## 🛠️ Development

### Project Structure
```
ai-terminal-emulator/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal.js   # Main terminal component
│   │   │   ├── Sidebar.js    # Navigation sidebar
│   │   │   ├── CommandInput.js # Input with suggestions
│   │   │   └── OutputLine.js # Command output display
│   │   └── App.js
│   └── package.json
├── backend/                  # FastAPI server
│   ├── main.py              # API endpoints
│   └── requirements.txt
├── src/                     # Core terminal engine
│   ├── terminal/
│   │   ├── core.py          # Terminal engine
│   │   ├── commands.py      # Command implementations
│   │   ├── system_monitor.py # System monitoring
│   │   └── ai_interpreter.py # AI integration
│   └── utils/
├── tests/                   # Test suite
└── docs/                    # Documentation
```

### API Endpoints
- `POST /api/execute` - Execute terminal commands
- `POST /api/suggestions` - Get command suggestions
- `GET /api/status` - Get terminal status
- `GET /docs` - Interactive API documentation

### Running Tests
```bash
# Backend tests
python tests/test_terminal.py

# Frontend tests
cd frontend && npm test

# Integration demo
python demo.py
```

## 🎯 Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_google_gemini_api_key  # Optional, enables full AI features
```

### Customization
- **UI Theme**: Modify `frontend/src/components/Terminal.css`
- **AI Behavior**: Update `src/terminal/ai_interpreter.py`
- **Commands**: Extend `src/terminal/commands.py`
- **System Monitoring**: Customize `src/terminal/system_monitor.py`

## 🔧 Advanced Features

### AI Integration Details
- **Gemini Pro Model**: Advanced natural language understanding
- **Streaming Support**: Architecture ready for real-time AI responses
- **Fallback Patterns**: 20+ regex patterns for offline functionality
- **Context Awareness**: Understands file operations, navigation, system commands

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Debounced Suggestions**: Reduces API calls while typing
- **Efficient Rendering**: Virtual scrolling for large outputs
- **Memory Management**: Automatic cleanup of old command history

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `npm test && python tests/test_terminal.py`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Areas for Contribution
- 🎨 UI/UX improvements
- 🤖 AI model enhancements
- 🔧 New terminal commands
- 📱 Mobile optimizations
- 🌐 Internationalization
- 📚 Documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Warp Terminal** - Design inspiration
- **Google Gemini** - AI natural language processing
- **React Team** - Amazing frontend framework
- **FastAPI** - High-performance Python web framework
- **Framer Motion** - Smooth animations
- **JetBrains** - Beautiful monospace font

## 📞 Support

- 📧 **Email**: support@ai-terminal.dev
- 💬 **Discord**: [Join our community](https://discord.gg/ai-terminal)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ai-terminal-emulator/issues)
- 📖 **Docs**: [Full Documentation](https://docs.ai-terminal.dev)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-terminal-emulator&type=Date)](https://star-history.com/#yourusername/ai-terminal-emulator&Date)

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star this repo](https://github.com/yourusername/ai-terminal-emulator) • [🐛 Report Bug](https://github.com/yourusername/ai-terminal-emulator/issues) • [✨ Request Feature](https://github.com/yourusername/ai-terminal-emulator/issues)

</div>