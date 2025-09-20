"""
AI-driven natural language command interpretation using Google Gemini.
"""
import re
import os
import asyncio
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class GeminiAIInterpreter:
    """Interprets natural language commands using Google Gemini AI."""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model = None
        self.fallback_patterns = self._init_fallback_patterns()
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                print(f"Warning: Could not initialize Gemini AI: {e}")
                self.model = None
    
    def is_natural_language(self, input_text: str) -> bool:
        """
        Determine if the input is natural language or a terminal command.
        
        Args:
            input_text: Input string to analyze
            
        Returns:
            True if input appears to be natural language, False if it's a command
        """
        input_text = input_text.strip().lower()
        
        # If it starts with common command patterns, it's likely a command
        command_indicators = [
            'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'echo', 'touch',
            'find', 'grep', 'ps', 'top', 'df', 'whoami', 'date', 'clear', 'history',
            'git', 'npm', 'docker', 'python', 'node', 'sudo', 'chmod', 'chown'
        ]
        
        first_word = input_text.split()[0] if input_text else ""
        if first_word in command_indicators:
            return False
        
        # If it contains natural language indicators, it's likely natural language
        natural_language_indicators = [
            'create', 'make', 'show', 'display', 'list', 'go to', 'change to',
            'navigate to', 'delete', 'remove', 'copy', 'move', 'find', 'search',
            'look for', 'where', 'what', 'how', 'can you', 'please', 'help me',
            'i want', 'i need', 'tell me', 'give me', 'open', 'close', 'start',
            'stop', 'run', 'execute', 'launch', 'install', 'uninstall', 'update'
        ]
        
        for indicator in natural_language_indicators:
            if indicator in input_text:
                return True
        
        # If it's a single word and not a command, it might be natural language
        if len(input_text.split()) == 1 and first_word not in command_indicators:
            return True
        
        # If it contains spaces and doesn't start with a command, likely natural language
        if ' ' in input_text and first_word not in command_indicators:
            return True
        
        return False

    def _init_fallback_patterns(self):
        """Initialize fallback regex patterns for when AI is unavailable."""
        return {
            # File operations
            r'create (?:a )?(?:new )?(?:file|document) (?:called |named )?(.+)': 'touch {0}',
            r'make (?:a )?(?:new )?(?:file|document) (?:called |named )?(.+)': 'touch {0}',
            r'create (?:a )?(?:text )?file (?:name |named )?(.+)': 'touch {0}',
            r'make (?:a )?(?:text )?file (?:name |named )?(.+)': 'touch {0}',
            r'create (?:a )?(?:new )?(?:folder|directory) (?:called |named )?(.+)': 'mkdir {0}',
            r'make (?:a )?(?:new )?(?:folder|directory) (?:called |named )?(.+)': 'mkdir {0}',
            
            # File viewing - specific patterns first
            r'show (?:me )?(?:the )?files': 'ls',
            r'list (?:the )?files': 'ls',
            r'show (?:me )?(?:the )?(?:contents? of )?(?:file )?(.+)': 'cat {0}',
            r'display (?:the )?(?:contents? of )?(?:file )?(.+)': 'cat {0}',
            r'read (?:the )?(?:file )?(.+)': 'cat {0}',
            
            # Directory operations - specific patterns first
            r'go to home directory': 'cd ~',
            r'change to home directory': 'cd ~',
            r'navigate to home directory': 'cd ~',
            r'go to the home directory': 'cd ~',
            r'change to the home directory': 'cd ~',
            r'navigate to the home directory': 'cd ~',
            r'list (?:the )?(?:files|contents?) (?:in |of )?(?:directory )?(.+)': 'ls {0}',
            r'show (?:me )?(?:the )?(?:files|contents?) (?:in |of )?(?:directory )?(.*)': 'ls {0}',
            r'go to (?:directory )?(.+)': 'cd {0}',
            r'change to (?:directory )?(.+)': 'cd {0}',
            r'navigate to (?:directory )?(.+)': 'cd {0}',
            
            # File operations
            r'delete (?:the )?(?:file )?(.+)': 'rm {0}',
            r'remove (?:the )?(?:file )?(.+)': 'rm {0}',
            r'copy (?:the )?(?:file )?(.+) to (.+)': 'cp {0} {1}',
            r'move (?:the )?(?:file )?(.+) to (.+)': 'mv {0} {1}',
            
            # System info
            r'show (?:me )?(?:the )?current (?:working )?directory': 'pwd',
            r'where am i': 'pwd',
            r'what(?:\'s| is) (?:the )?(?:current )?(?:working )?directory': 'pwd',
            r'show (?:me )?(?:the )?(?:running )?processes': 'ps',
            r'list (?:the )?(?:running )?processes': 'ps',
            r'show (?:me )?(?:the )?system (?:info|information)': 'top',
            r'show (?:me )?(?:the )?disk usage': 'df',
            
            # Search operations
            r'find (?:the )?(?:file )?(.+)': 'find . -name "*{0}*"',
            r'search for (?:the )?(?:file )?(.+)': 'find . -name "*{0}*"',
            r'look for (?:the )?(?:file )?(.+)': 'find . -name "*{0}*"',
            
            # Misc
            r'clear (?:the )?(?:screen|terminal)': 'clear',
            r'clean (?:the )?(?:screen|terminal)': 'clear',
            r'show (?:me )?(?:the )?(?:command )?history': 'history',
        }
    
    def is_available(self) -> bool:
        """Check if Gemini AI is available."""
        return self.model is not None
    
    async def interpret_async(self, natural_command: str) -> Optional[str]:
        """
        Convert natural language command to terminal command using AI.
        
        Args:
            natural_command: Natural language input
            
        Returns:
            Terminal command string or None if no match
        """
        if self.model:
            try:
                return await self._interpret_with_gemini(natural_command)
            except Exception as e:
                print(f"AI interpretation failed: {e}")
                # Fallback to regex patterns
                return self._interpret_with_patterns(natural_command)
        else:
            return self._interpret_with_patterns(natural_command)
    
    def interpret(self, natural_command: str) -> Optional[str]:
        """Synchronous version of interpret_async."""
        if self.model:
            try:
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(self._interpret_with_gemini(natural_command))
            except Exception as e:
                print(f"AI interpretation failed: {e}")
                return self._interpret_with_patterns(natural_command)
        else:
            return self._interpret_with_patterns(natural_command)
    
    async def _interpret_with_gemini(self, natural_command: str) -> Optional[str]:
        """Use Gemini AI to interpret natural language commands."""
        prompt = f"""
You are a terminal command interpreter. Convert the following natural language request into a single, executable terminal command.

Available commands include: ls, cd, pwd, mkdir, rmdir, rm, cp, mv, cat, echo, touch, find, grep, ps, top, df, whoami, date, clear, history, help

Rules:
1. Return ONLY the terminal command, no explanations
2. Use standard Unix/Linux command syntax
3. If the request is unclear or impossible, return "INVALID"
4. For file/folder names with spaces, use quotes
5. Be conservative - only return commands you're confident about

Natural language request: "{natural_command}"

Terminal command:"""

        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            command = response.text.strip()
            
            # Validate the response
            if command and command != "INVALID" and not command.startswith("I"):
                # Basic validation - ensure it starts with a known command
                first_word = command.split()[0]
                valid_commands = {
                    'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 
                    'cat', 'echo', 'touch', 'find', 'grep', 'ps', 'top', 
                    'df', 'whoami', 'date', 'clear', 'history', 'help'
                }
                
                if first_word in valid_commands:
                    return command
            
            return None
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            return None
    
    def _interpret_with_patterns(self, natural_command: str) -> Optional[str]:
        """Fallback interpretation using regex patterns."""
        natural_command = natural_command.strip().lower()
        
        for pattern, command_template in self.fallback_patterns.items():
            match = re.match(pattern, natural_command)
            if match:
                groups = match.groups()
                cleaned_groups = []
                for group in groups:
                    if group:
                        cleaned = group.strip().strip('"\'')
                        cleaned_groups.append(cleaned)
                    else:
                        cleaned_groups.append('')
                
                try:
                    return command_template.format(*cleaned_groups)
                except IndexError:
                    return command_template.format(*cleaned_groups[:command_template.count('{')])
        
        return None
    
    async def get_suggestions_async(self, partial_input: str) -> List[str]:
        """Get AI-powered command suggestions."""
        if self.model and len(partial_input) >= 3:
            try:
                return await self._get_ai_suggestions(partial_input)
            except Exception:
                return self.get_basic_suggestions(partial_input)
        else:
            return self.get_basic_suggestions(partial_input)
    
    async def _get_ai_suggestions(self, partial_input: str) -> List[str]:
        """Get suggestions using Gemini AI."""
        prompt = f"""
Complete the following natural language command for a terminal. Provide 3-5 realistic completions that make sense.

Partial input: "{partial_input}"

Return only the completed phrases, one per line, without numbering or explanations.
Focus on common terminal operations like file management, directory navigation, system monitoring, etc.

Completions:"""

        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            suggestions = [line.strip() for line in response.text.strip().split('\n') if line.strip()]
            return suggestions[:5]  # Limit to 5 suggestions
        except Exception:
            return self.get_basic_suggestions(partial_input)
    
    def get_basic_suggestions(self, partial_input: str) -> List[str]:
        """Get basic suggestions using predefined patterns."""
        suggestions = []
        partial_lower = partial_input.lower()
        
        common_phrases = [
            "create a new file called",
            "create a new folder called", 
            "show me the contents of",
            "list the files in",
            "go to directory",
            "delete the file",
            "copy file",
            "move file",
            "show current directory",
            "show running processes",
            "show system information",
            "find file",
            "clear the screen"
        ]
        
        for phrase in common_phrases:
            if phrase.startswith(partial_lower):
                suggestions.append(phrase)
        
        return suggestions[:5]
    
    def process_input(self, user_input: str) -> dict:
        """
        Process user input and determine if it's natural language or a command.
        
        Args:
            user_input: User input string
            
        Returns:
            Dictionary with 'command', 'is_natural_language', 'original_input', and 'interpretation'
        """
        user_input = user_input.strip()
        
        if not user_input:
            return {
                'command': '',
                'is_natural_language': False,
                'original_input': user_input,
                'interpretation': None
            }
        
        # Check if it's natural language
        is_natural = self.is_natural_language(user_input)
        
        if is_natural:
            # Try to interpret as natural language
            interpreted_command = self.interpret(user_input)
            if interpreted_command:
                return {
                    'command': interpreted_command,
                    'is_natural_language': True,
                    'original_input': user_input,
                    'interpretation': f"Interpreted: '{user_input}' -> '{interpreted_command}'"
                }
            else:
                # If interpretation fails, return the original input as a command
                return {
                    'command': user_input,
                    'is_natural_language': False,
                    'original_input': user_input,
                    'interpretation': f"Could not interpret natural language: '{user_input}'"
                }
        else:
            # It's already a command
            return {
                'command': user_input,
                'is_natural_language': False,
                'original_input': user_input,
                'interpretation': None
            }


# Backward compatibility
class AIInterpreter(GeminiAIInterpreter):
    """Alias for backward compatibility."""
    pass