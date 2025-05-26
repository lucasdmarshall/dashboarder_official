import uvicorn
import sys
import os

# Add the parent directory to the path to allow importing the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    print("Starting Dashboarder LMS API...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True) 