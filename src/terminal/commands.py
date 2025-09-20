"""
Command implementations for the terminal.
"""
import os
import shutil
import stat
import time
import subprocess
from typing import Dict, List, Tuple, Callable
from datetime import datetime


class CommandRegistry:
    """Registry for all terminal commands."""
    
    def __init__(self):
        self.commands: Dict[str, Callable] = {
            'ls': self.cmd_ls,
            'cd': self.cmd_cd,
            'pwd': self.cmd_pwd,
            'mkdir': self.cmd_mkdir,
            'rmdir': self.cmd_rmdir,
            'rm': self.cmd_rm,
            'cp': self.cmd_cp,
            'mv': self.cmd_mv,
            'cat': self.cmd_cat,
            'echo': self.cmd_echo,
            'touch': self.cmd_touch,
            'find': self.cmd_find,
            'grep': self.cmd_grep,
            'ps': self.cmd_ps,
            'top': self.cmd_top,
            'df': self.cmd_df,
            'whoami': self.cmd_whoami,
            'date': self.cmd_date,
            'clear': self.cmd_clear,
            'history': self.cmd_history,
            'help': self.cmd_help,
            'exit': self.cmd_exit,
        }
    
    def execute(self, command: str, args: List[str], terminal) -> Tuple[str, int]:
        """Execute a command with given arguments."""
        return self.commands[command](args, terminal)
    
    def cmd_ls(self, args: List[str], terminal) -> Tuple[str, int]:
        """List directory contents."""
        try:
            show_hidden = '-a' in args
            long_format = '-l' in args
            
            # Remove flags from args to get path
            path_args = [arg for arg in args if not arg.startswith('-')]
            path = path_args[0] if path_args else terminal.current_directory
            
            if not os.path.isabs(path):
                path = os.path.join(terminal.current_directory, path)
            
            if not os.path.exists(path):
                return f"ls: cannot access '{path}': No such file or directory", 1
            
            if os.path.isfile(path):
                return os.path.basename(path), 0
            
            items = os.listdir(path)
            if not show_hidden:
                items = [item for item in items if not item.startswith('.')]
            
            items.sort()
            
            if long_format:
                output = []
                for item in items:
                    item_path = os.path.join(path, item)
                    stat_info = os.stat(item_path)
                    
                    # File type and permissions
                    mode = stat_info.st_mode
                    if stat.S_ISDIR(mode):
                        file_type = 'd'
                    else:
                        file_type = '-'
                    
                    perms = stat.filemode(mode)[1:]
                    
                    # Size and date
                    size = stat_info.st_size
                    mtime = datetime.fromtimestamp(stat_info.st_mtime)
                    date_str = mtime.strftime('%b %d %H:%M')
                    
                    output.append(f"{file_type}{perms} {size:>8} {date_str} {item}")
                
                return '\n'.join(output), 0
            else:
                return '  '.join(items), 0
                
        except PermissionError:
            return f"ls: cannot open directory '{path}': Permission denied", 1
        except Exception as e:
            return f"ls: {str(e)}", 1
    
    def cmd_cd(self, args: List[str], terminal) -> Tuple[str, int]:
        """Change directory."""
        path = args[0] if args else os.path.expanduser("~")
        return terminal.change_directory(path)
    
    def cmd_pwd(self, args: List[str], terminal) -> Tuple[str, int]:
        """Print working directory."""
        return terminal.current_directory, 0
    
    def cmd_mkdir(self, args: List[str], terminal) -> Tuple[str, int]:
        """Create directory."""
        if not args:
            return "mkdir: missing operand", 1
        
        try:
            for dir_name in args:
                if not os.path.isabs(dir_name):
                    dir_path = os.path.join(terminal.current_directory, dir_name)
                else:
                    dir_path = dir_name
                
                os.makedirs(dir_path, exist_ok=False)
            return "", 0
        except FileExistsError:
            return f"mkdir: cannot create directory '{dir_name}': File exists", 1
        except Exception as e:
            return f"mkdir: {str(e)}", 1
    
    def cmd_rmdir(self, args: List[str], terminal) -> Tuple[str, int]:
        """Remove empty directory."""
        if not args:
            return "rmdir: missing operand", 1
        
        try:
            for dir_name in args:
                if not os.path.isabs(dir_name):
                    dir_path = os.path.join(terminal.current_directory, dir_name)
                else:
                    dir_path = dir_name
                
                os.rmdir(dir_path)
            return "", 0
        except OSError as e:
            return f"rmdir: {str(e)}", 1
    
    def cmd_rm(self, args: List[str], terminal) -> Tuple[str, int]:
        """Remove files and directories."""
        if not args:
            return "rm: missing operand", 1
        
        recursive = '-r' in args or '-rf' in args
        force = '-f' in args or '-rf' in args
        
        # Remove flags from args
        files = [arg for arg in args if not arg.startswith('-')]
        
        try:
            for file_name in files:
                if not os.path.isabs(file_name):
                    file_path = os.path.join(terminal.current_directory, file_name)
                else:
                    file_path = file_name
                
                if not os.path.exists(file_path):
                    if not force:
                        return f"rm: cannot remove '{file_name}': No such file or directory", 1
                    continue
                
                if os.path.isdir(file_path):
                    if recursive:
                        shutil.rmtree(file_path)
                    else:
                        return f"rm: cannot remove '{file_name}': Is a directory", 1
                else:
                    os.remove(file_path)
            return "", 0
        except Exception as e:
            return f"rm: {str(e)}", 1
    
    def cmd_cp(self, args: List[str], terminal) -> Tuple[str, int]:
        """Copy files and directories."""
        if len(args) < 2:
            return "cp: missing file operand", 1
        
        try:
            source = args[0]
            dest = args[1]
            
            if not os.path.isabs(source):
                source = os.path.join(terminal.current_directory, source)
            if not os.path.isabs(dest):
                dest = os.path.join(terminal.current_directory, dest)
            
            if os.path.isdir(source):
                shutil.copytree(source, dest)
            else:
                shutil.copy2(source, dest)
            return "", 0
        except Exception as e:
            return f"cp: {str(e)}", 1
    
    def cmd_mv(self, args: List[str], terminal) -> Tuple[str, int]:
        """Move/rename files and directories."""
        if len(args) < 2:
            return "mv: missing file operand", 1
        
        try:
            source = args[0]
            dest = args[1]
            
            if not os.path.isabs(source):
                source = os.path.join(terminal.current_directory, source)
            if not os.path.isabs(dest):
                dest = os.path.join(terminal.current_directory, dest)
            
            shutil.move(source, dest)
            return "", 0
        except Exception as e:
            return f"mv: {str(e)}", 1
    
    def cmd_cat(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display file contents."""
        if not args:
            return "cat: missing file operand", 1
        
        try:
            output = []
            for file_name in args:
                if not os.path.isabs(file_name):
                    file_path = os.path.join(terminal.current_directory, file_name)
                else:
                    file_path = file_name
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    output.append(f.read())
            
            return '\n'.join(output), 0
        except FileNotFoundError:
            return f"cat: {file_name}: No such file or directory", 1
        except Exception as e:
            return f"cat: {str(e)}", 1
    
    def cmd_echo(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display text."""
        return ' '.join(args), 0
    
    def cmd_touch(self, args: List[str], terminal) -> Tuple[str, int]:
        """Create empty files or update timestamps."""
        if not args:
            return "touch: missing file operand", 1
        
        try:
            for file_name in args:
                if not os.path.isabs(file_name):
                    file_path = os.path.join(terminal.current_directory, file_name)
                else:
                    file_path = file_name
                
                if os.path.exists(file_path):
                    # Update timestamp
                    os.utime(file_path, None)
                else:
                    # Create empty file
                    open(file_path, 'a').close()
            return "", 0
        except Exception as e:
            return f"touch: {str(e)}", 1
    
    def cmd_find(self, args: List[str], terminal) -> Tuple[str, int]:
        """Find files and directories."""
        if not args:
            path = terminal.current_directory
            pattern = "*"
        elif len(args) == 1:
            if os.path.exists(args[0]):
                path = args[0]
                pattern = "*"
            else:
                path = terminal.current_directory
                pattern = args[0]
        else:
            path = args[0]
            pattern = args[1]
        
        try:
            if not os.path.isabs(path):
                path = os.path.join(terminal.current_directory, path)
            
            results = []
            for root, dirs, files in os.walk(path):
                for item in dirs + files:
                    if pattern == "*" or pattern in item:
                        results.append(os.path.join(root, item))
            
            return '\n'.join(results), 0
        except Exception as e:
            return f"find: {str(e)}", 1
    
    def cmd_grep(self, args: List[str], terminal) -> Tuple[str, int]:
        """Search text in files."""
        if len(args) < 2:
            return "grep: missing pattern or file", 1
        
        pattern = args[0]
        files = args[1:]
        
        try:
            results = []
            for file_name in files:
                if not os.path.isabs(file_name):
                    file_path = os.path.join(terminal.current_directory, file_name)
                else:
                    file_path = file_name
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if pattern in line:
                            results.append(f"{file_name}:{line_num}:{line.rstrip()}")
            
            return '\n'.join(results), 0
        except Exception as e:
            return f"grep: {str(e)}", 1
    
    def cmd_ps(self, args: List[str], terminal) -> Tuple[str, int]:
        """List running processes."""
        return terminal.system_monitor.get_processes(), 0
    
    def cmd_top(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display system resource usage."""
        return terminal.system_monitor.get_system_info(), 0
    
    def cmd_df(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display disk usage."""
        return terminal.system_monitor.get_disk_usage(), 0
    
    def cmd_whoami(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display current user."""
        return os.getenv('USER', 'unknown'), 0
    
    def cmd_date(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display current date and time."""
        return datetime.now().strftime('%a %b %d %H:%M:%S %Z %Y'), 0
    
    def cmd_clear(self, args: List[str], terminal) -> Tuple[str, int]:
        """Clear the terminal screen."""
        return '\033[2J\033[H', 0
    
    def cmd_history(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display command history."""
        output = []
        for i, cmd in enumerate(terminal.command_history, 1):
            output.append(f"{i:4d}  {cmd}")
        return '\n'.join(output), 0
    
    def cmd_help(self, args: List[str], terminal) -> Tuple[str, int]:
        """Display available commands."""
        commands = sorted(self.commands.keys())
        output = "Available commands:\n"
        output += "  " + "  ".join(commands)
        return output, 0
    
    def cmd_exit(self, args: List[str], terminal) -> Tuple[str, int]:
        """Exit the terminal."""
        return "exit", 0