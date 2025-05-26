"""
Cleanup service for automatic deletion of processed instructor registrations
"""

import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import InstructorRegistration

logger = logging.getLogger(__name__)

def cleanup_old_registrations():
    """
    Delete instructor registrations that are older than 12 hours and have status 'approved' or 'rejected'.
    Approved registrations have already been converted to User accounts.
    Rejected registrations don't need to be kept indefinitely.
    """
    db: Session = SessionLocal()
    
    try:
        # Calculate the cutoff time (12 hours ago)
        cutoff_time = datetime.utcnow() - timedelta(hours=12)
        
        # Find registrations to delete
        registrations_to_delete = db.query(InstructorRegistration).filter(
            InstructorRegistration.status.in_(['approved', 'rejected']),
            InstructorRegistration.reviewed_at <= cutoff_time
        ).all()
        
        if not registrations_to_delete:
            logger.info("No old instructor registrations found for cleanup")
            return
        
        # Log what we're about to delete
        deleted_count = len(registrations_to_delete)
        approved_count = len([r for r in registrations_to_delete if r.status == 'approved'])
        rejected_count = len([r for r in registrations_to_delete if r.status == 'rejected'])
        
        logger.info(f"Cleaning up {deleted_count} instructor registrations: {approved_count} approved, {rejected_count} rejected")
        
        # Delete the registrations
        for registration in registrations_to_delete:
            logger.info(f"Deleting {registration.status} registration: {registration.name} ({registration.email}) - reviewed at {registration.reviewed_at}")
            db.delete(registration)
        
        # Commit the deletions
        db.commit()
        
        logger.info(f"Successfully cleaned up {deleted_count} old instructor registrations")
        
    except Exception as e:
        logger.error(f"Error during instructor registration cleanup: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

def cleanup_old_registrations_safe():
    """
    Safe wrapper for cleanup_old_registrations that handles exceptions
    """
    try:
        cleanup_old_registrations()
    except Exception as e:
        logger.error(f"Cleanup task failed: {str(e)}") 