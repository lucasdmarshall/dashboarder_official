from app.database import SessionLocal
from app.models import InstructorRegistration
from app.cleanup_service import cleanup_old_registrations
from datetime import datetime, timedelta

db = SessionLocal()

# Get the first 2 already reviewed registrations
regs = db.query(InstructorRegistration).filter(InstructorRegistration.status.in_(['approved', 'rejected'])).limit(2).all()
print(f'Found {len(regs)} reviewed registrations')

if len(regs) >= 2:
    # Set their reviewed_at to 13 hours ago to make them eligible for cleanup
    old_time = datetime.utcnow() - timedelta(hours=13)
    for reg in regs:
        reg.reviewed_at = old_time
        print(f'Updated {reg.name} reviewed_at to 13 hours ago')
    
    db.commit()
    print('✅ Test data prepared')
    
    # Count before cleanup
    total_before = db.query(InstructorRegistration).count()
    old_count = db.query(InstructorRegistration).filter(
        InstructorRegistration.status.in_(['approved', 'rejected']),
        InstructorRegistration.reviewed_at <= old_time
    ).count()
    
    print(f'Before cleanup: {total_before} total, {old_count} old records')
    
    # Run cleanup
    print('🧹 Running cleanup...')
    cleanup_old_registrations()
    
    # Count after cleanup
    total_after = db.query(InstructorRegistration).count()
    print(f'After cleanup: {total_after} total (deleted {total_before - total_after} records)')
    
else:
    print('No reviewed registrations found')

db.close() 