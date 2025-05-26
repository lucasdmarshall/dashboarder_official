#!/usr/bin/env python3
"""
Migration script to add languages column to instructor_profiles table
Run this script from the lms-backend directory:
python add_languages_column.py
"""

import logging
from sqlalchemy import create_engine, text
from app.config import settings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_languages_column():
    """Add languages column to instructor_profiles table"""
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as connection:
            # Start transaction
            with connection.begin():
                # Check if column already exists
                check_column_query = text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'instructor_profiles' 
                    AND column_name = 'languages'
                """)
                
                result = connection.execute(check_column_query).fetchone()
                
                if result:
                    logger.info("✅ Languages column already exists in instructor_profiles table")
                    return
                
                # Add languages column
                logger.info("Adding languages column to instructor_profiles table...")
                add_column_query = text("""
                    ALTER TABLE instructor_profiles 
                    ADD COLUMN languages TEXT
                """)
                
                connection.execute(add_column_query)
                logger.info("✅ Successfully added languages column to instructor_profiles table")
                
                # Set default value for existing rows
                logger.info("Setting default languages for existing instructor profiles...")
                update_default_query = text("""
                    UPDATE instructor_profiles 
                    SET languages = '["English"]' 
                    WHERE languages IS NULL
                """)
                
                result = connection.execute(update_default_query)
                updated_count = result.rowcount
                logger.info(f"✅ Updated {updated_count} existing instructor profiles with default language")
                
        logger.info("🎉 Migration completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    add_languages_column() 