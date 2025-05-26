#!/usr/bin/env python3
"""
Script to fix duplicate student enrollments.
Ensures each student can only be enrolled in one institution at a time.
"""

from app.database import SessionLocal
from app.models import User, UserRole, EnrolledStudent, StudentApplication
from sqlalchemy import func
from collections import defaultdict

def fix_duplicate_enrollments():
    """Fix duplicate enrollments by keeping only the most recent one for each student"""
    db = SessionLocal()
    try:
        print("🔍 Checking for duplicate enrollments...")
        
        # Find all enrolled students
        enrolled_students = db.query(EnrolledStudent).all()
        
        # Group by email to find duplicates
        student_enrollments = defaultdict(list)
        for enrollment in enrolled_students:
            student_enrollments[enrollment.student_email].append(enrollment)
        
        duplicates_found = 0
        students_fixed = 0
        
        for email, enrollments in student_enrollments.items():
            if len(enrollments) > 1:
                duplicates_found += 1
                print(f"\n⚠️ DUPLICATE FOUND: {email}")
                
                # Sort by enrolled_at (most recent first)
                enrollments.sort(key=lambda x: x.enrolled_at, reverse=True)
                
                # Keep the most recent enrollment
                keep_enrollment = enrollments[0]
                remove_enrollments = enrollments[1:]
                
                # Show what we're keeping and removing
                keep_institution = db.query(User).filter(User.id == keep_enrollment.institution_id).first()
                print(f"  ✅ KEEPING: {keep_institution.name if keep_institution else 'Unknown'} (enrolled: {keep_enrollment.enrolled_at})")
                
                for enrollment in remove_enrollments:
                    remove_institution = db.query(User).filter(User.id == enrollment.institution_id).first()
                    print(f"  ❌ REMOVING: {remove_institution.name if remove_institution else 'Unknown'} (enrolled: {enrollment.enrolled_at})")
                    
                    # Also remove any pending applications for this institution
                    pending_apps = db.query(StudentApplication).filter(
                        StudentApplication.student_email == email,
                        StudentApplication.institution_id == enrollment.institution_id
                    ).all()
                    for app in pending_apps:
                        db.delete(app)
                        print(f"    🗑️ Deleted pending application")
                    
                    db.delete(enrollment)
                
                # Update User.institution_id to match the kept enrollment
                student_user = db.query(User).filter(
                    User.email == email,
                    User.role == UserRole.STUDENT
                ).first()
                
                if student_user:
                    student_user.institution_id = keep_enrollment.institution_id
                    print(f"  🔄 Updated User.institution_id to match kept enrollment")
                
                students_fixed += 1
        
        if duplicates_found > 0:
            db.commit()
            print(f"\n✅ Fixed {students_fixed} students with duplicate enrollments")
        else:
            print("\n✅ No duplicate enrollments found - data is clean")
        
        # Show final summary
        print("\n📊 Final Status:")
        total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
        enrolled_students_count = db.query(EnrolledStudent).count()
        pending_applications = db.query(StudentApplication).count()
        
        print(f"Total Students: {total_students}")
        print(f"Enrolled Students: {enrolled_students_count}")
        print(f"Pending Applications: {pending_applications}")
        
        # Show breakdown by institution
        institutions = db.query(User).filter(User.role == UserRole.INSTITUTION).all()
        for institution in institutions:
            enrolled_count = db.query(EnrolledStudent).filter(
                EnrolledStudent.institution_id == institution.id,
                EnrolledStudent.status == "active"
            ).count()
            pending_count = db.query(StudentApplication).filter(
                StudentApplication.institution_id == institution.id
            ).count()
            print(f"  {institution.name}: {enrolled_count} enrolled, {pending_count} pending applications")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error fixing duplicate enrollments: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Starting duplicate enrollment cleanup...")
    fix_duplicate_enrollments()
    print("🎉 Cleanup complete!") 