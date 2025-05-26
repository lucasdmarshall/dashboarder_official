#!/usr/bin/env python3
"""
Utility script to clear sample/hardcoded data from institutions
so they can set their own custom profile information.
"""

from app.database import SessionLocal
from app.models import User, UserRole

def clear_institution_sample_data(institution_name=None):
    """Clear sample data for institutions."""
    db = SessionLocal()
    try:
        if institution_name:
            # Clear specific institution
            institutions = db.query(User).filter(
                User.role == UserRole.INSTITUTION,
                User.name == institution_name
            ).all()
        else:
            # Clear all institutions
            institutions = db.query(User).filter(User.role == UserRole.INSTITUTION).all()
        
        if not institutions:
            print(f"No institutions found{'with name: ' + institution_name if institution_name else ''}")
            return
        
        for inst in institutions:
            print(f"Clearing sample data for: {inst.name}")
            
            # Clear profile fields
            inst.cover_photo = None
            inst.profile_picture = None
            inst.description = None
            inst.phone = None
            inst.address = None
            inst.website = None
            inst.established_year = None
            
            # Reset ratings
            inst.total_rating = 0
            inst.rating_count = 0
            inst.average_rating = 0.0
        
        db.commit()
        print(f"✅ Successfully cleared sample data for {len(institutions)} institution(s)")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing sample data: {e}")
    finally:
        db.close()

def main():
    """Main function with command line interface."""
    import sys
    
    if len(sys.argv) > 1:
        institution_name = sys.argv[1]
        print(f"Clearing sample data for institution: {institution_name}")
        clear_institution_sample_data(institution_name)
    else:
        print("Clearing sample data for ALL institutions...")
        response = input("Are you sure? (y/N): ")
        if response.lower() == 'y':
            clear_institution_sample_data()
        else:
            print("Operation cancelled.")

if __name__ == "__main__":
    main() 