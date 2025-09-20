"""
FastAPI backend for the AI Terminal Emulator with Gemini integration.
"""
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))

from terminal.core import TerminalCore
from terminal.ai_interpreter import GeminiAIInterpreter

app = FastAPI(title="AI Terminal Emulator API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global terminal instance
terminal = TerminalCore()
ai_interpreter = GeminiAIInterpreter()

class CommandRequest(BaseModel):
    command: str

class SuggestionRequest(BaseModel):
    partial: str

class CommandResponse(BaseModel):
    output: str
    exit_code: int
    directory: str
    interpreted_command: Optional[str] = None

class SuggestionResponse(BaseModel):
    suggestions: List[str]

@app.get("/")
async def root():
    return {"message": "AI Terminal Emulator API", "status": "running"}

@app.post("/api/execute", response_model=CommandResponse)
async def execute_command(request: CommandRequest):
    """Execute a terminal command or AI natural language command."""
    try:
        command = request.command.strip()
        interpreted_command = None
        
        # Check if it's an AI command
        if command.lower().startswith('ai '):
            natural_command = command[3:].strip()
            
            # Use Gemini AI to interpret the command
            interpreted_command = await ai_interpreter.interpret_async(natural_command)
            
            if interpreted_command:
                output, exit_code = terminal.execute_command(interpreted_command)
                # Add interpretation info to output
                if output:
                    output = f"🤖 Interpreted: '{natural_command}' → '{interpreted_command}'\n\n{output}"
                else:
                    output = f"🤖 Interpreted: '{natural_command}' → '{interpreted_command}'"
            else:
                output = f"❌ Could not interpret: '{natural_command}'"
                exit_code = 1
        else:
            # Execute regular command
            output, exit_code = terminal.execute_command(command)
        
        return CommandResponse(
            output=output,
            exit_code=exit_code,
            directory=terminal.current_directory,
            interpreted_command=interpreted_command
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    """Get AI-powered command suggestions."""
    try:
        partial = request.partial.strip()
        
        if not partial:
            return SuggestionResponse(suggestions=[])
        
        # Get AI suggestions
        suggestions = await ai_interpreter.get_suggestions_async(partial)
        
        return SuggestionResponse(suggestions=suggestions)
        
    except Exception as e:
        # Fallback to basic suggestions if AI fails
        basic_suggestions = ai_interpreter.get_basic_suggestions(request.partial)
        return SuggestionResponse(suggestions=basic_suggestions)

@app.get("/api/status")
async def get_status():
    """Get terminal status."""
    return {
        "current_directory": terminal.current_directory,
        "command_history_count": len(terminal.command_history),
        "ai_enabled": ai_interpreter.is_available()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)