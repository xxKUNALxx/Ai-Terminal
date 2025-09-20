# Manual Testing Guide for AI Terminal

This guide will help you manually test the AI natural language commands in the terminal.

## 🚀 Quick Start

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd terminal_project
./start_backend.sh
```
You should see: `INFO: Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd terminal_project
./start_frontend.sh
```
You should see: `Local: http://localhost:3000`

### 2. Open the Application
- Open your browser and go to `http://localhost:3000`
- You should see a beautiful terminal interface with a sidebar

## 🧪 Test Cases

### Basic Commands (No AI)
Test these regular terminal commands first:

```bash
pwd
ls
echo "Hello World"
whoami
date
mkdir test_folder
ls
touch test_file.txt
ls -la
cat test_file.txt
rm test_file.txt
rmdir test_folder
ls
```

### AI Natural Language Commands
Test these AI-powered commands (prefix with "ai"):

#### File Operations
```bash
ai create a new file called hello.txt
ai create a new folder called documents
ai show me the contents of hello.txt
ai list all files in this directory
ai delete the file hello.txt
ai remove the folder documents
```

#### Directory Navigation
```bash
ai show me the current directory
ai go to the home directory
ai navigate to the documents folder
ai where am i
```

#### System Information
```bash
ai show running processes
ai show system information
ai show disk usage
ai what processes are running
```

#### File Management
```bash
ai create a file named data.txt
ai copy data.txt to backup.txt
ai move backup.txt to archive.txt
ai find files named data
ai search for txt files
```

## 🎯 Expected Behavior

### With AI (Gemini API Key Set)
- Commands should be interpreted by AI
- You'll see: `🤖 Interpreted: 'create a file' → 'touch filename'`
- More flexible natural language understanding
- Smart suggestions as you type

### Without AI (No API Key)
- Commands use fallback regex patterns
- Still works for common phrases
- Basic suggestions available
- Less flexible but functional

## 🔍 What to Look For

### ✅ Success Indicators
- Commands execute and show output
- AI interpretation messages appear
- Suggestions popup shows when typing
- Terminal responds smoothly
- No error messages in browser console

### ❌ Potential Issues
- "Command not found" errors
- No AI interpretation messages
- Suggestions not appearing
- Backend connection errors
- Slow response times

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8000/

# Check backend logs
cd terminal_project/backend
python3 main.py
```

### Frontend Issues
```bash
# Check if frontend is running
curl http://localhost:3000/

# Restart frontend
cd terminal_project/frontend
npm start
```

### AI Issues
```bash
# Check if Gemini API key is set
echo $GEMINI_API_KEY

# Test AI endpoint directly
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "ai create a file called test.txt"}'
```

## 📝 Test Results Template

Use this template to record your test results:

```
## Test Session: [Date/Time]

### Environment
- OS: [macOS/Linux/Windows]
- Browser: [Chrome/Firefox/Safari]
- AI API Key: [Set/Not Set]

### Basic Commands
- [x] pwd - Working
- [x] ls - Working
- [ ] mkdir - Issue: [describe]

### AI Commands
- [x] ai create file - Working, interpreted correctly
- [x] ai list files - Working
- [ ] ai show processes - Issue: [describe]

### UI/UX
- [x] Suggestions popup - Working
- [x] Typing animation - Working
- [x] Sidebar - Working

### Issues Found
1. [Issue description]
2. [Issue description]

### Overall Rating: [1-10]
```

## 🎨 UI Features to Test

### Visual Elements
- Glassmorphism effects (translucent panels)
- Gradient backgrounds
- Smooth animations
- Responsive design (try resizing window)

### Interactive Elements
- Command input with cursor
- Suggestion popup (appears when typing)
- Sidebar workflows (hover effects)
- Terminal scrolling
- Command history (up/down arrows)

### Keyboard Shortcuts
- `↑/↓` - Command history navigation
- `Tab` - Accept suggestion
- `Esc` - Close suggestions
- `Enter` - Execute command

## 📊 Performance Testing

### Response Times
- Regular commands: < 100ms
- AI commands: < 2-3 seconds
- Suggestions: < 500ms

### Memory Usage
- Check browser dev tools for memory leaks
- Monitor backend memory usage

## 🔄 Continuous Testing

For ongoing development, test these scenarios regularly:

1. **New User Experience**: Clear browser cache and test first-time usage
2. **Long Sessions**: Run commands for 30+ minutes to test stability
3. **Error Handling**: Try invalid commands and malformed input
4. **Edge Cases**: Very long commands, special characters, etc.

## 📞 Getting Help

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the backend terminal for Python errors
3. Verify all dependencies are installed
4. Ensure ports 3000 and 8000 are available
5. Try restarting both servers

Happy testing! 🚀