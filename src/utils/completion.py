"""
Auto-completion logic for the terminal.
"""
import os
from typing import List
from prompt_toolkit.completion import Completer, Completion, WordCompleter


class AutoCompleter:
    """Auto-completion for terminal commands and file paths."""
    
    def __init__(self, terminal):
        self.terminal = terminal
        self.command_names = list(terminal.command_registry.commands.keys())
    
    def get_completer(self) -> Completer:
        """Get the appropriate completer based on context."""
        return CustomCompleter(self.terminal, self.command_names)


class CustomCompleter(Completer):
    """Custom completer that handles commands and file paths."""
    
    def __init__(self, terminal, command_names: List[str]):
        self.terminal = terminal
        self.command_names = command_names
    
    def get_completions(self, document, complete_event):
        """Generate completions for the current input."""
        text = document.text_before_cursor
        words = text.split()
        
        if not words or (len(words) == 1 and not text.endswith(' ')):
            # Complete command names
            current_word = words[0] if words else ''
            for command in self.command_names:
                if command.startswith(current_word):
                    yield Completion(
                        command,
                        start_position=-len(current_word)
                    )
        else:
            # Complete file/directory names
            if text.endswith(' '):
                current_word = ''
                start_pos = 0
            else:
                current_word = words[-1]
                start_pos = -len(current_word)
            
            # Get directory to search in
            if '/' in current_word:
                dir_path = os.path.dirname(current_word)
                file_prefix = os.path.basename(current_word)
                
                if dir_path.startswith('/'):
                    search_dir = dir_path
                elif dir_path.startswith('~'):
                    search_dir = os.path.expanduser(dir_path)
                else:
                    search_dir = os.path.join(self.terminal.current_directory, dir_path)
            else:
                search_dir = self.terminal.current_directory
                file_prefix = current_word
            
            # Find matching files/directories
            try:
                if os.path.exists(search_dir) and os.path.isdir(search_dir):
                    for item in os.listdir(search_dir):
                        if item.startswith(file_prefix):
                            full_path = os.path.join(search_dir, item)
                            if os.path.isdir(full_path):
                                completion_text = item + '/'
                            else:
                                completion_text = item
                            
                            yield Completion(
                                completion_text,
                                start_position=start_pos
                            )
            except (PermissionError, OSError):
                pass