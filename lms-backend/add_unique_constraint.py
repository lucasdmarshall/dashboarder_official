#!/usr/bin/env python3
"""
Migration script to add unique constraint on student_email in enrolled_students table.
This prevents race conditions during concurrent application acceptances.
"""

from app.database import SessionLocal, engine
from sqlalchemy import text
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_unique_constraint():
    """Add unique constraint on student_email in enrolled_students table"""
    db = SessionLocal()
    try:
        logger.info("🔧 Starting migration to add unique constraint...")
        
        # First, check if constraint already exists
        check_constraint_sql = """
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'enrolled_students' 
        AND constraint_name = 'uq_enrolled_student_email'
        AND constraint_type = 'UNIQUE';
        """
        
        result = db.execute(text(check_constraint_sql)).fetchone()
        
        if result:
            logger.info("✅ Unique constraint already exists - no migration needed")
            return
        
        # Check for existing duplicates before adding constraint
        logger.info("🔍 Checking for duplicate enrollments...")
        
        duplicates_sql = """
        SELECT student_email, COUNT(*) as count
        FROM enrolled_students 
        GROUP BY student_email 
        HAVING COUNT(*) > 1;
        """
        
        duplicates = db.execute(text(duplicates_sql)).fetchall()
        
        if duplicates:
            logger.warning(f"⚠️ Found {len(duplicates)} duplicate enrollments. Please run fix_duplicate_enrollments.py first:")
            for dup in duplicates:
                logger.warning(f"  - {dup.student_email}: {dup.count} enrollments")
            return False
        
        logger.info("✅ No duplicates found - safe to add constraint")
        
        # Add the unique constraint
        add_constraint_sql = """
        ALTER TABLE enrolled_students 
        ADD CONSTRAINT uq_enrolled_student_email 
        UNIQUE (student_email);
        """
        
        db.execute(text(add_constraint_sql))
        
        # Add indexes for performance
        add_indexes_sql = [
            "CREATE INDEX IF NOT EXISTS idx_enrolled_student_institution_id ON enrolled_students (institution_id);",
            "CREATE INDEX IF NOT EXISTS idx_enrolled_student_email ON enrolled_students (student_email);",
            "CREATE INDEX IF NOT EXISTS idx_enrolled_student_status ON enrolled_students (status);"
        ]
        
        for index_sql in add_indexes_sql:
            try:
                db.execute(text(index_sql))
                logger.info(f"✅ Added index: {index_sql.split('ON')[0].split('IF NOT EXISTS')[1].strip()}")
            except Exception as e:
                logger.warning(f"⚠️ Index may already exist: {e}")
        
        db.commit()
        logger.info("✅ Successfully added unique constraint and indexes")
        
        # Verify the constraint was added
        verify_result = db.execute(text(check_constraint_sql)).fetchone()
        if verify_result:
            logger.info("✅ Unique constraint verified successfully")
        else:
            logger.error("❌ Failed to verify unique constraint")
            return False
        
        return True
        
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error adding unique constraint: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("🚀 Starting database migration...")
    success = add_unique_constraint()
    if success:
        logger.info("🎉 Migration completed successfully!")
    else:
        logger.error("❌ Migration failed - please check logs and fix issues") 