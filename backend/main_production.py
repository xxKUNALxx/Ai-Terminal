"""
Production FastAPI backend for the AI Terminal Emulator with static file serving.
"""
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global terminal instance - start in home directory
terminal = TerminalCore(initial_directory="~")
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
    is_natural_language: Optional[bool] = False
    original_input: Optional[str] = None
    interpretation: Optional[str] = None

class SuggestionResponse(BaseModel):
    suggestions: List[str]

@app.get("/")
async def root():
    return {"message": "AI Terminal Emulator API", "status": "running"}

@app.post("/api/execute", response_model=CommandResponse)
async def execute_command(request: CommandRequest):
    """Execute a terminal command or AI natural language command."""
    try:
        user_input = request.command.strip()
        
        if not user_input:
            return CommandResponse(
                output="",
                exit_code=0,
                directory=terminal.current_directory,
                interpreted_command=None
            )
        
        # Process input with AI interpreter
        processed = ai_interpreter.process_input(user_input)
        
        # Execute the command
        output, exit_code = terminal.execute_command(processed['command'])
        
        # Prepare response
        interpreted_command = processed['command'] if processed['is_natural_language'] else None
        
        # If it was natural language, show the interpretation
        if processed['is_natural_language'] and processed['interpretation']:
            if output:
                output = f"🤖 {processed['interpretation']}\n\n{output}"
            else:
                output = f"🤖 {processed['interpretation']}"
        
        return CommandResponse(
            output=output,
            exit_code=exit_code,
            directory=terminal.current_directory,
            interpreted_command=interpreted_command,
            is_natural_language=processed['is_natural_language'],
            original_input=processed['original_input'],
            interpretation=processed['interpretation']
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

# Serve static files from frontend build directory
frontend_build_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "build")
if os.path.exists(frontend_build_path):
    app.mount("/", StaticFiles(directory=frontend_build_path, html=True), name="static")
    
    @app.get("/{path:path}")
    async def serve_spa(path: str):
        """Serve the React app for any non-API routes."""
        if not path.startswith("api/"):
            return FileResponse(os.path.join(frontend_build_path, "index.html"))
        return {"error": "Not found"}

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the server
    uvicorn.run("main_production:app", host="0.0.0.0", port=port, reload=False)
