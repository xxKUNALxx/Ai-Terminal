"""
Command Line Interface for the terminal.
"""
import sys
import os
from typing import List
from prompt_toolkit import prompt
from prompt_toolkit.history import InMemoryHistory
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.shortcuts import clear
from colorama import init, Fore, Style

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from terminal.core import TerminalCore
from terminal.ai_interpreter import AIInterpreter
from utils.completion import AutoCompleter

# Initialize colorama for cross-platform colored output
init()


class CLIInterface:
    """Command Line Interface for the terminal."""
    
    def __init__(self):
        self.terminal = TerminalCore()
        self.history = InMemoryHistory()
        self.auto_completer = AutoCompleter(self.terminal)
        self.ai_interpreter = AIInterpreter()
        self.running = True
        self.ai_mode = False
        
    def run(self):
        """Main CLI loop."""
        print(f"{Fore.GREEN}Python Terminal Emulator{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Type 'help' for available commands or 'exit' to quit{Style.RESET_ALL}")
        print()
        
        while self.running:
            try:
                # Get command completer
                completer = self.auto_completer.get_completer()
                
                # Get user input with prompt
                prompt_text = f"{Fore.CYAN}{self.terminal.get_prompt()}{Style.RESET_ALL}"
                
                user_input = prompt(
                    prompt_text,
                    history=self.history,
                    completer=completer,
                    complete_while_typing=True
                )
                
                # Handle special commands
                if user_input.strip().lower() == 'exit':
                    self.running = False
                    print(f"{Fore.GREEN}Goodbye!{Style.RESET_ALL}")
                    break
                elif user_input.strip().lower() == 'clear':
                    clear()
                    continue
                elif user_input.strip().lower().startswith('ai '):
                    # AI natural language interpretation
                    natural_command = user_input[3:].strip()
                    interpreted_command = self.ai_interpreter.interpret(natural_command)
                    
                    if interpreted_command:
                        print(f"{Fore.YELLOW}Interpreted: '{natural_command}' -> '{interpreted_command}'{Style.RESET_ALL}")
                        output, exit_code = self.terminal.execute_command(interpreted_command)
                    else:
                        output = f"Could not interpret: '{natural_command}'"
                        exit_code = 1
                        
                    # Display output
                    if output:
                        if exit_code == 0:
                            print(output)
                        else:
                            print(f"{Fore.RED}{output}{Style.RESET_ALL}")
                    continue
                
                # Execute command
                output, exit_code = self.terminal.execute_command(user_input)
                
                # Display output
                if output:
                    if exit_code == 0:
                        print(output)
                    else:
                        print(f"{Fore.RED}{output}{Style.RESET_ALL}")
                
            except KeyboardInterrupt:
                print(f"\n{Fore.YELLOW}Use 'exit' to quit{Style.RESET_ALL}")
                continue
            except EOFError:
                self.running = False
                print(f"\n{Fore.GREEN}Goodbye!{Style.RESET_ALL}")
                break
            except Exception as e:
                print(f"{Fore.RED}Error: {str(e)}{Style.RESET_ALL}")


def main():
    """Entry point for CLI interface."""
    cli = CLIInterface()
    cli.run()


if __name__ == "__main__":
    main()