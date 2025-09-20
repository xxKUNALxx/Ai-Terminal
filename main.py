#!/usr/bin/env python3
"""
Main entry point for the Python Terminal Emulator.
"""
import sys
import os
import argparse

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from interface.cli import CLIInterface
from terminal.ai_interpreter import AIInterpreter


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Python Terminal Emulator')
    parser.add_argument('--ai', action='store_true', 
                       help='Enable AI natural language interpretation')
    parser.add_argument('--web', action='store_true',
                       help='Start web interface (requires Flask)')
    
    args = parser.parse_args()
    
    if args.web:
        try:
            from interface.web import WebInterface, create_web_template
            # Create template if it doesn't exist
            create_web_template()
            web_interface = WebInterface()
            web_interface.run()
        except ImportError:
            print("Web interface requires Flask. Install with: pip install flask")
            sys.exit(1)
    else:
        # Start CLI interface
        cli = CLIInterface()
        
        if args.ai:
            # Enable AI interpretation
            ai_interpreter = AIInterpreter()
            cli.terminal.ai_interpreter = ai_interpreter
            print("AI natural language interpretation enabled!")
            print("Try commands like: 'create a new folder called test'")
            print()
        
        cli.run()


if __name__ == "__main__":
    main()