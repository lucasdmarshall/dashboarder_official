from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create engine for PostgreSQL using the available psycopg2
sync_engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

# Create a Base class for declarative models
Base = declarative_base()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For backward compatibility with existing code that expects async
async def get_async_session():
    """Temporary sync-to-async adapter until we can install asyncpg"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Use sync engine for table creation
engine = sync_engine 