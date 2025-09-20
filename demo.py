#!/usr/bin/env python3
"""
Demo script showing terminal capabilities.
"""
import sys
import os
import time

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from terminal.core import TerminalCore
from terminal.ai_interpreter import AIInterpreter


def demo_basic_commands():
    """Demonstrate basic terminal commands."""
    print("=== Basic Commands Demo ===")
    terminal = TerminalCore()
    
    commands = [
        "pwd",
        "ls",
        "echo Welcome to Python Terminal!",
        "whoami",
        "date",
        "help"
    ]
    
    for cmd in commands:
        print(f"\n$ {cmd}")
        output, code = terminal.execute_command(cmd)
        if output:
            print(output)
        time.sleep(1)


def demo_file_operations():
    """Demonstrate file operations."""
    print("\n\n=== File Operations Demo ===")
    terminal = TerminalCore()
    
    commands = [
        "mkdir demo_folder",
        "touch demo_file.txt",
        "ls -l",
        "cd demo_folder",
        "pwd",
        "cd ..",
        "rm demo_file.txt",
        "rmdir demo_folder",
        "ls"
    ]
    
    for cmd in commands:
        print(f"\n$ {cmd}")
        output, code = terminal.execute_command(cmd)
        if output:
            print(output)
        if code != 0:
            print(f"Command failed with exit code: {code}")
        time.sleep(1)


def demo_ai_interpreter():
    """Demonstrate AI natural language interpretation."""
    print("\n\n=== AI Natural Language Demo ===")
    ai = AIInterpreter()
    
    natural_commands = [
        "create a new file called ai_test.txt",
        "make a folder named ai_folder", 
        "show me the current directory",
        "list the files",
        "delete the file ai_test.txt",
        "show running processes"
    ]
    
    for natural_cmd in natural_commands:
        interpreted = ai.interpret(natural_cmd)
        print(f"\nNatural: '{natural_cmd}'")
        print(f"Interpreted: '{interpreted}'")
        time.sleep(1)


def demo_system_monitoring():
    """Demonstrate system monitoring."""
    print("\n\n=== System Monitoring Demo ===")
    terminal = TerminalCore()
    
    commands = [
        "ps",
        "top", 
        "df"
    ]
    
    for cmd in commands:
        print(f"\n$ {cmd}")
        output, code = terminal.execute_command(cmd)
        if output:
            # Limit output for demo
            lines = output.split('\n')
            for line in lines[:10]:  # Show first 10 lines
                print(line)
            if len(lines) > 10:
                print("... (output truncated)")
        time.sleep(2)


def main():
    """Run the demo."""
    print("Python Terminal Emulator - Interactive Demo")
    print("=" * 50)
    
    try:
        demo_basic_commands()
        demo_file_operations()
        demo_ai_interpreter()
        demo_system_monitoring()
        
        print("\n\n🎉 Demo completed!")
        print("\nTo try the terminal interactively:")
        print("  python main.py              # CLI mode")
        print("  python main.py --ai         # CLI with AI")
        print("  python main.py --web        # Web interface")
        
    except KeyboardInterrupt:
        print("\n\nDemo interrupted by user.")
    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")


if __name__ == "__main__":
    main()