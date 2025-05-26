#!/usr/bin/env python3
"""
Migration script to create InstructorProfile table and add payment fields to User table
"""

import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.config import settings
from app.models import Base
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migration():
    """Run the migration to add InstructorProfile table and payment fields"""
    
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        logger.info("Starting migration...")
        
        # Add new columns to users table for payment features
        logger.info("Adding payment-related columns to users table...")
        
        # Add red_mark column in separate transaction
        try:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN red_mark BOOLEAN DEFAULT NULL"))
            logger.info("Added red_mark column")
        except Exception as e:
            if "already exists" in str(e).lower():
                logger.info("red_mark column already exists")
            else:
                raise
        
        # Add level column in separate transaction
        try:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN level INTEGER DEFAULT NULL"))
            logger.info("Added level column")
        except Exception as e:
            if "already exists" in str(e).lower():
                logger.info("level column already exists")
            else:
                raise
        
        # Create all tables (this will create InstructorProfile if it doesn't exist)
        logger.info("Creating InstructorProfile table...")
        Base.metadata.create_all(bind=engine)
        
        logger.info("Migration completed successfully!")
        
        # Verify the tables exist
        with engine.begin() as conn:
            result = conn.execute(text("SELECT tablename FROM pg_tables WHERE tablename='instructor_profiles'"))
            if result.fetchone():
                logger.info("✓ InstructorProfile table created successfully")
            else:
                logger.error("✗ InstructorProfile table not found")
                
            # Check if columns were added
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users'"))
            columns = [row[0] for row in result.fetchall()]
            
            if 'red_mark' in columns:
                logger.info("✓ red_mark column added to users table")
            else:
                logger.error("✗ red_mark column not found in users table")
                
            if 'level' in columns:
                logger.info("✓ level column added to users table")
            else:
                logger.error("✗ level column not found in users table")
        
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    run_migration() 