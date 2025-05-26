#!/usr/bin/env python3
"""
Test script for instructor registration cleanup functionality
"""

from app.database import SessionLocal
from app.models import InstructorRegistration
from app.cleanup_service import cleanup_old_registrations
from datetime import datetime, timedelta
import uuid

def prepare_test_data():
    """Prepare test data by marking some registrations with old timestamps"""
    db = SessionLocal()
    
    try:
        # Get a few registrations to test with
        regs = db.query(InstructorRegistration).filter(InstructorRegistration.status == 'pending').limit(3).all()
        print(f'Found {len(regs)} pending registrations to test with')

        # Mark one as approved and one as rejected with old timestamps (13 hours ago) for testing
        if len(regs) >= 2:
            old_time = datetime.utcnow() - timedelta(hours=13)
            
            # Approve first one with old timestamp
            regs[0].status = 'approved'
            regs[0].reviewed_at = old_time
            regs[0].reviewed_by = uuid.uuid4()
            print(f'Marked {regs[0].name} as approved 13 hours ago')
            
            # Reject second one with old timestamp  
            regs[1].status = 'rejected'
            regs[1].reviewed_at = old_time
            regs[1].reviewed_by = uuid.uuid4()
            print(f'Marked {regs[1].name} as rejected 13 hours ago')
            
            db.commit()
            print('✅ Test data prepared for cleanup testing')
            return True
        else:
            print('❌ Not enough pending registrations for testing')
            return False
            
    except Exception as e:
        print(f'❌ Error preparing test data: {e}')
        db.rollback()
        return False
    finally:
        db.close()

def show_registrations():
    """Show current registrations"""
    db = SessionLocal()
    
    try:
        regs = db.query(InstructorRegistration).all()
        print(f'\nCurrent registrations ({len(regs)} total):')
        for reg in regs:
            reviewed_status = f"reviewed {reg.reviewed_at}" if reg.reviewed_at else "not reviewed"
            print(f'- {reg.name} ({reg.email}) - {reg.status} - {reviewed_status}')
        
    except Exception as e:
        print(f'❌ Error showing registrations: {e}')
    finally:
        db.close()

def test_cleanup():
    """Test the cleanup functionality"""
    print('\n🧹 Testing cleanup functionality...')
    
    try:
        cleanup_old_registrations()
        print('✅ Cleanup completed successfully')
    except Exception as e:
        print(f'❌ Cleanup failed: {e}')

if __name__ == "__main__":
    print("🧪 Instructor Registration Cleanup Test")
    print("=" * 50)
    
    # Show current state
    show_registrations()
    
    # Prepare test data
    print("\n📝 Preparing test data...")
    if prepare_test_data():
        
        # Show state after preparation
        show_registrations()
        
        # Test cleanup
        test_cleanup()
        
        # Show final state
        show_registrations()
    else:
        print("❌ Could not prepare test data. Please ensure there are pending registrations in the database.") 