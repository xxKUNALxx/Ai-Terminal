#!/usr/bin/env python3
"""
Simple test script for the terminal emulator.
"""
import sys
import os
import tempfile
import shutil

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))

from terminal.core import TerminalCore
from terminal.ai_interpreter import AIInterpreter


def test_basic_commands():
    """Test basic terminal commands."""
    print("Testing basic commands...")
    terminal = TerminalCore()
    
    # Test pwd
    output, code = terminal.execute_command("pwd")
    assert code == 0
    print(f"✓ pwd: {output}")
    
    # Test echo
    output, code = terminal.execute_command("echo Hello World")
    assert code == 0 and "Hello World" in output
    print(f"✓ echo: {output}")
    
    # Test ls
    output, code = terminal.execute_command("ls")
    assert code == 0
    print(f"✓ ls: Found {len(output.split()) if output else 0} items")
    
    # Test help
    output, code = terminal.execute_command("help")
    assert code == 0 and "Available commands" in output
    print("✓ help: Command list displayed")
    
    print("Basic commands test passed!\n")


def test_file_operations():
    """Test file operations in a temporary directory."""
    print("Testing file operations...")
    
    # Create temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        terminal = TerminalCore()
        
        # Change to temp directory
        output, code = terminal.execute_command(f"cd {temp_dir}")
        assert code == 0
        
        # Create a test file
        output, code = terminal.execute_command("touch test.txt")
        assert code == 0
        print("✓ touch: Created test file")
        
        # Create a directory
        output, code = terminal.execute_command("mkdir testdir")
        assert code == 0
        print("✓ mkdir: Created directory")
        
        # List files
        output, code = terminal.execute_command("ls")
        assert code == 0 and "test.txt" in output and "testdir" in output
        print("✓ ls: Files and directories listed")
        
        # Write to file using echo and redirection simulation
        with open(os.path.join(temp_dir, "test.txt"), "w") as f:
            f.write("Hello from test file")
        
        # Read file
        output, code = terminal.execute_command("cat test.txt")
        assert code == 0 and "Hello from test file" in output
        print("✓ cat: File content read")
        
        # Copy file
        output, code = terminal.execute_command("cp test.txt test_copy.txt")
        assert code == 0
        print("✓ cp: File copied")
        
        # Remove file
        output, code = terminal.execute_command("rm test.txt")
        assert code == 0
        print("✓ rm: File removed")
        
    print("File operations test passed!\n")


def test_ai_interpreter():
    """Test AI natural language interpretation."""
    print("Testing AI interpreter...")
    ai = AIInterpreter()
    
    test_cases = [
        ("create a new file called test.txt", "touch test.txt"),
        ("make a folder named documents", "mkdir documents"),
        ("show me the contents of file.txt", "cat file.txt"),
        ("list the files", "ls "),
        ("go to home directory", "cd home"),
        ("delete the file old.txt", "rm old.txt"),
        ("show current directory", "pwd"),
        ("clear the screen", "clear"),
    ]
    
    for natural, expected in test_cases:
        result = ai.interpret(natural)
        if result and expected.strip() in result:
            print(f"✓ '{natural}' -> '{result}'")
        else:
            print(f"✗ '{natural}' -> '{result}' (expected: '{expected}')")
    
    print("AI interpreter test completed!\n")


def test_system_monitoring():
    """Test system monitoring commands."""
    print("Testing system monitoring...")
    # Ensure we're in a valid directory
    os.chdir(os.path.dirname(os.path.dirname(__file__)))
    terminal = TerminalCore()
    
    # Test ps command
    try:
        output, code = terminal.execute_command("ps")
        if code == 0 and "PID" in output:
            print("✓ ps: Process list displayed")
        else:
            print(f"✗ ps failed: code={code}, output={output[:100]}...")
    except Exception as e:
        print(f"✗ ps error: {e}")
    
    # Test top command
    try:
        output, code = terminal.execute_command("top")
        if code == 0 and ("CPU" in output or "Memory" in output):
            print("✓ top: System info displayed")
        else:
            print(f"✗ top failed: code={code}, output={output[:100]}...")
    except Exception as e:
        print(f"✗ top error: {e}")
    
    # Test df command
    try:
        output, code = terminal.execute_command("df")
        if code == 0 and "Filesystem" in output:
            print("✓ df: Disk usage displayed")
        else:
            print(f"✗ df failed: code={code}, output={output[:100]}...")
    except Exception as e:
        print(f"✗ df error: {e}")
    
    print("System monitoring test completed!\n")


def main():
    """Run all tests."""
    print("Python Terminal Emulator - Test Suite")
    print("=" * 40)
    
    try:
        test_basic_commands()
        test_file_operations()
        test_ai_interpreter()
        test_system_monitoring()
        
        print("🎉 All tests completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()