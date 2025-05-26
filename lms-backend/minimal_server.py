from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(title="Dashboarder LMS API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Dashboarder LMS API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Temporary API endpoints to test the server
@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend server is working!", "data": "test data"}

if __name__ == "__main__":
    print("Starting minimal LMS API server...")
    uvicorn.run("minimal_server:app", host="0.0.0.0", port=5001, reload=True) 