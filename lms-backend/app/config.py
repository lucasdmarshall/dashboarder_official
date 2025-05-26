from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://leon@localhost:5432/lms_db")
    
    # JWT and authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "5eff3e85-b5c0-42a0-982d-d682ffdbf02e")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # CORS settings
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3001")
    
    # fastapi-users settings
    RESET_PASSWORD_TOKEN_SECRET: str = os.getenv("RESET_PASSWORD_TOKEN_SECRET", "reset-secret-key")
    VERIFICATION_TOKEN_SECRET: str = os.getenv("VERIFICATION_TOKEN_SECRET", "verification-secret-key")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings() 