#!/usr/bin/env python3
"""
Simple AI Assistant using Ollama
"""

import os
import requests
import subprocess
import json

# Configuration
MODEL = "phi3:mini"
OLLAMA_API = "http://localhost:11434/api/generate"

def get_ai_response(prompt):
    """Get a response from the AI model using Ollama API"""
    try:
        # Make the API request to Ollama
        response = requests.post(
            OLLAMA_API,
            json={
                "model": MODEL,
                "prompt": prompt,
                "max_tokens": 1000,
                "stream": False
            }
        )
        
        if response.status_code == 200:
            return response.json()["response"].strip()
        else:
            return f"Error: API returned status code {response.status_code}"
    
    except Exception as e:
        return f"Error communicating with Ollama: {str(e)}"

def execute_command(command):
    """Execute a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return f"Exit code: {result.returncode}\n\nOutput:\n{result.stdout}\n\nErrors:\n{result.stderr}"
    except Exception as e:
        return f"Error executing command: {str(e)}"

def main():
    # Print welcome message
    print("\n" + "="*50)
    print(f"🤖 Simple Local AI Assistant (using {MODEL} on Ollama)")
    print("="*50)
    print("Type 'exit' or 'quit' to end the session")
    print("Type 'cmd: your_command' to execute a shell command")
    print("="*50 + "\n")
    
    try:
        while True:
            # Get user input
            user_input = input("\nYou: ")
            
            # Check for exit commands
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break
            
            # Check for shell command
            if user_input.lower().startswith("cmd:"):
                command = user_input[4:].strip()
                print(f"Executing: {command}")
                result = execute_command(command)
                print(result)
                continue
            
            # Get AI response
            print("\nAI Assistant:", end=" ")
            response = get_ai_response(user_input)
            print(response)
                
    except KeyboardInterrupt:
        print("\n\nGoodbye!")
    except Exception as e:
        print(f"\n\nError: {str(e)}")

if __name__ == "__main__":
    main() 