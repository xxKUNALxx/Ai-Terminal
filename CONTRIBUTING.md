# Contributing to AI Terminal Emulator

Thank you for your interest in contributing to AI Terminal Emulator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- Basic knowledge of React and FastAPI

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/ai-terminal-emulator.git
   cd ai-terminal-emulator
   ```
3. Install dependencies:
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt
   
   # Frontend
   cd frontend && npm install
   ```
4. Start development servers:
   ```bash
   ./start_backend.sh
   ./start_frontend.sh
   ```

## 🎯 How to Contribute

### Reporting Bugs
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - OS and browser version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Describe:
   - The problem you're solving
   - Your proposed solution
   - Alternative solutions considered

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
Follow conventional commits:
```
type(scope): description

feat(ai): add streaming response support
fix(ui): resolve mobile layout issues
docs(readme): update installation instructions
```

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Update documentation if needed
5. Run the test suite
6. Submit a pull request

## 🧪 Testing

### Running Tests
```bash
# Backend tests
python tests/test_terminal.py

# Frontend tests
cd frontend && npm test

# Integration tests
python demo.py
```

### Test Coverage
- Aim for >80% test coverage
- Include unit tests for new functions
- Add integration tests for new features
- Test error handling scenarios

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Maximum line length: 88 characters

### JavaScript/React (Frontend)
- Use ESLint configuration
- Follow React best practices
- Use functional components with hooks
- Prefer const/let over var

### CSS
- Use CSS modules or styled-components
- Follow BEM naming convention
- Ensure responsive design
- Test on multiple browsers

## 🏗️ Architecture Guidelines

### Backend Structure
```
backend/
├── main.py              # FastAPI app and routes
├── models/              # Pydantic models
├── services/            # Business logic
└── utils/               # Helper functions
```

### Frontend Structure
```
frontend/src/
├── components/          # React components
├── hooks/              # Custom hooks
├── services/           # API calls
├── utils/              # Helper functions
└── styles/             # Global styles
```

### Adding New Commands
1. Add command logic to `src/terminal/commands.py`
2. Update command registry
3. Add tests
4. Update documentation

### AI Integration
1. Extend patterns in `ai_interpreter.py`
2. Test with and without API key
3. Ensure fallback functionality
4. Add usage examples

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency**: Follow existing design patterns
- **Accessibility**: Support keyboard navigation and screen readers
- **Performance**: Optimize for smooth animations
- **Responsiveness**: Test on mobile and desktop

### Color Scheme
- Primary: `#667eea` (Purple-blue gradient)
- Secondary: `#764ba2` (Deep purple)
- Success: `#4ecdc4` (Teal)
- Error: `#ff6b6b` (Red)
- Text: `#ffffff` (White)

### Typography
- Primary font: JetBrains Mono
- Font sizes: 12px (mobile), 14px (desktop)
- Line height: 1.6

## 📚 Documentation

### Code Documentation
- Document all public functions
- Include usage examples
- Explain complex algorithms
- Keep comments up to date

### User Documentation
- Update README for new features
- Add examples to MANUAL_TESTING.md
- Create tutorials for complex features
- Include screenshots/GIFs

## 🔍 Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is adequate
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Review Timeline
- Initial review: Within 48 hours
- Follow-up reviews: Within 24 hours
- Merge: After approval from maintainers

## 🏷️ Release Process

### Versioning
We use Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Tagged release created

## 🤝 Community

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Discord: Real-time chat and support

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to the contributors team
- Given credit in documentation

## ❓ Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Join our Discord community

Thank you for contributing to AI Terminal Emulator! 🚀