"""
Web interface for the terminal using Flask.
"""
import sys
import os
from flask import Flask, render_template, request, jsonify

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from terminal.core import TerminalCore
from terminal.ai_interpreter import AIInterpreter


class WebInterface:
    """Web-based terminal interface."""
    
    def __init__(self):
        self.app = Flask(__name__)
        self.terminal = TerminalCore()
        self.ai_interpreter = AIInterpreter()
        self.setup_routes()
    
    def setup_routes(self):
        """Setup Flask routes."""
        
        @self.app.route('/')
        def index():
            return render_template('terminal.html')
        
        @self.app.route('/execute', methods=['POST'])
        def execute_command():
            data = request.get_json()
            command = data.get('command', '').strip()
            
            if not command:
                return jsonify({'output': '', 'exit_code': 0, 'prompt': self.terminal.get_prompt()})
            
            # Check if it's a natural language command (starts with 'ai ')
            if command.lower().startswith('ai '):
                natural_command = command[3:].strip()
                interpreted_command = self.ai_interpreter.interpret(natural_command)
                
                if interpreted_command:
                    output, exit_code = self.terminal.execute_command(interpreted_command)
                    ai_output = f"Interpreted: '{natural_command}' -> '{interpreted_command}'\n{output}"
                    return jsonify({
                        'output': ai_output,
                        'exit_code': exit_code,
                        'prompt': self.terminal.get_prompt()
                    })
                else:
                    return jsonify({
                        'output': f"Could not interpret: '{natural_command}'",
                        'exit_code': 1,
                        'prompt': self.terminal.get_prompt()
                    })
            
            # Execute regular command
            output, exit_code = self.terminal.execute_command(command)
            
            return jsonify({
                'output': output,
                'exit_code': exit_code,
                'prompt': self.terminal.get_prompt()
            })
        
        @self.app.route('/complete', methods=['POST'])
        def auto_complete():
            data = request.get_json()
            partial_command = data.get('command', '')
            
            # Simple completion for commands
            commands = list(self.terminal.command_registry.commands.keys())
            matches = [cmd for cmd in commands if cmd.startswith(partial_command)]
            
            return jsonify({'completions': matches})
    
    def run(self, host='localhost', port=5000, debug=True):
        """Run the web interface."""
        print(f"Starting web terminal at http://{host}:{port}")
        print("Press Ctrl+C to stop")
        self.app.run(host=host, port=port, debug=debug)


# Create templates directory and HTML template
def create_web_template():
    """Create the HTML template for the web interface."""
    template_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(template_dir, exist_ok=True)
    
    html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Terminal Emulator</title>
    <style>
        body {
            background-color: #1e1e1e;
            color: #ffffff;
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
        }
        
        .terminal {
            background-color: #000000;
            border: 2px solid #333333;
            border-radius: 5px;
            padding: 20px;
            height: 80vh;
            overflow-y: auto;
        }
        
        .output {
            white-space: pre-wrap;
            margin-bottom: 10px;
        }
        
        .error {
            color: #ff6b6b;
        }
        
        .prompt {
            color: #4ecdc4;
        }
        
        .input-line {
            display: flex;
            align-items: center;
        }
        
        #command-input {
            background: transparent;
            border: none;
            color: #ffffff;
            font-family: inherit;
            font-size: inherit;
            outline: none;
            flex: 1;
            margin-left: 5px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .help {
            background-color: #2d2d2d;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Python Terminal Emulator</h1>
        <div class="help">
            <strong>Commands:</strong> ls, cd, pwd, mkdir, rm, cat, echo, ps, top, df, help, clear<br>
            <strong>AI Mode:</strong> Type "ai" followed by natural language (e.g., "ai create a new folder called test")
        </div>
    </div>
    
    <div class="terminal" id="terminal">
        <div class="output">Welcome to Python Terminal Emulator</div>
        <div class="output">Type 'help' for available commands</div>
        <div class="input-line">
            <span class="prompt" id="prompt">user@localhost:~$ </span>
            <input type="text" id="command-input" autocomplete="off" autofocus>
        </div>
    </div>

    <script>
        const terminal = document.getElementById('terminal');
        const commandInput = document.getElementById('command-input');
        const promptElement = document.getElementById('prompt');
        
        commandInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const command = commandInput.value;
                executeCommand(command);
                commandInput.value = '';
            }
        });
        
        function executeCommand(command) {
            // Display the command
            const commandLine = document.createElement('div');
            commandLine.className = 'output';
            commandLine.innerHTML = `<span class="prompt">${promptElement.textContent}</span>${command}`;
            
            // Insert before the input line
            const inputLine = document.querySelector('.input-line');
            terminal.insertBefore(commandLine, inputLine);
            
            // Handle clear command locally
            if (command.trim() === 'clear') {
                clearTerminal();
                return;
            }
            
            // Send command to server
            fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: command })
            })
            .then(response => response.json())
            .then(data => {
                if (data.output) {
                    const output = document.createElement('div');
                    output.className = data.exit_code === 0 ? 'output' : 'output error';
                    output.textContent = data.output;
                    terminal.insertBefore(output, inputLine);
                }
                
                // Update prompt
                promptElement.textContent = data.prompt;
                
                // Scroll to bottom
                terminal.scrollTop = terminal.scrollHeight;
            })
            .catch(error => {
                const errorOutput = document.createElement('div');
                errorOutput.className = 'output error';
                errorOutput.textContent = 'Error: ' + error.message;
                terminal.insertBefore(errorOutput, inputLine);
                terminal.scrollTop = terminal.scrollHeight;
            });
        }
        
        function clearTerminal() {
            const outputs = terminal.querySelectorAll('.output');
            outputs.forEach(output => output.remove());
        }
        
        // Focus input when clicking on terminal
        terminal.addEventListener('click', function() {
            commandInput.focus();
        });
    </script>
</body>
</html>'''
    
    with open(os.path.join(template_dir, 'terminal.html'), 'w') as f:
        f.write(html_content)


if __name__ == "__main__":
    create_web_template()
    web_interface = WebInterface()
    web_interface.run()