"""
Core terminal engine that processes and executes commands.
"""
import os
import sys
import shlex
from typing import Dict, List, Tuple, Optional
from .commands import CommandRegistry
from .system_monitor import SystemMonitor


class TerminalCore:
    """Main terminal engine for processing commands."""
    
    def __init__(self, initial_directory: str = None):
        # Set initial directory - default to home directory or user-specified
        if initial_directory:
            self.current_directory = os.path.expanduser(initial_directory)
        else:
            # Try to start in home directory, fallback to current working directory
            home_dir = os.path.expanduser("~")
            if os.path.exists(home_dir):
                self.current_directory = home_dir
            else:
                self.current_directory = os.getcwd()
        
        # Change to the initial directory
        try:
            os.chdir(self.current_directory)
        except (PermissionError, OSError):
            # If we can't change to the desired directory, stay where we are
            self.current_directory = os.getcwd()
        
        self.command_history = []
        self.command_registry = CommandRegistry()
        self.system_monitor = SystemMonitor()
        self.environment_vars = dict(os.environ)
        
    def execute_command(self, command_line: str) -> Tuple[str, int]:
        """
        Execute a command and return output and exit code.
        
        Args:
            command_line: The command string to execute
            
        Returns:
            Tuple of (output, exit_code)
        """
        if not command_line.strip():
            return "", 0
            
        # Add to history
        self.command_history.append(command_line)
        
        try:
            # Parse command
            parts = shlex.split(command_line)
            command = parts[0]
            args = parts[1:] if len(parts) > 1 else []
            
            # Handle built-in commands
            if command in self.command_registry.commands:
                return self.command_registry.execute(command, args, self)
            else:
                return f"Command not found: {command}", 1
                
        except Exception as e:
            return f"Error: {str(e)}", 1
    
    def get_prompt(self) -> str:
        """Generate the terminal prompt."""
        username = os.getenv('USER', 'user')
        hostname = os.getenv('HOSTNAME', 'localhost')
        current_dir = os.path.basename(self.current_directory) or '/'
        return f"{username}@{hostname}:{current_dir}$ "
    
    def change_directory(self, path: str) -> Tuple[str, int]:
        """Change the current working directory."""
        try:
            if path == "~":
                path = os.path.expanduser("~")
            elif path.startswith("~/"):
                path = os.path.expanduser(path)
            elif not os.path.isabs(path):
                path = os.path.join(self.current_directory, path)
            
            path = os.path.normpath(path)
            
            if os.path.exists(path) and os.path.isdir(path):
                self.current_directory = path
                os.chdir(path)
                return "", 0
            else:
                return f"cd: no such file or directory: {path}", 1
        except PermissionError:
            return f"cd: permission denied: {path}", 1
        except Exception as e:
            return f"cd: {str(e)}", 1