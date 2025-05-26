#!/usr/bin/env python3
"""
Script to sync student data between User.institution_id and EnrolledStudent table.
This fixes the inconsistency where students show up in admin but not in institution dashboards.
"""

from app.database import SessionLocal
from app.models import User, UserRole, EnrolledStudent
import uuid
import random
import string

def generate_student_id(db, institution_id):
    """Generate a unique random student ID for the institution"""
    max_attempts = 100
    for _ in range(max_attempts):
        # Generate random 4-digit number
        random_number = random.randint(1000, 9999)
        student_id = f"STD{random_number}"
        
        # Check if this ID already exists in the institution
        existing = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution_id,
            EnrolledStudent.student_id == student_id
        ).first()
        
        if not existing:
            return student_id
    
    # Fallback: use UUID if we couldn't generate a unique random ID
    return f"STD{str(uuid.uuid4())[:8].upper()}"

def sync_student_enrollment():
    """Sync students from User.institution_id to EnrolledStudent table"""
    db = SessionLocal()
    try:
        print("🔍 Checking for students to sync...")
        
        # Find students who have institution_id but are not in EnrolledStudent table
        students_with_institution = db.query(User).filter(
            User.role == UserRole.STUDENT,
            User.institution_id.isnot(None)
        ).all()
        
        synced_count = 0
        
        for student in students_with_institution:
            # Check if student is already enrolled
            existing_enrollment = db.query(EnrolledStudent).filter(
                EnrolledStudent.student_email == student.email
            ).first()
            
            if existing_enrollment:
                print(f"✅ {student.name} ({student.email}) - Already enrolled")
                continue
            
            # Get institution info
            institution = db.query(User).filter(
                User.id == student.institution_id,
                User.role == UserRole.INSTITUTION
            ).first()
            
            if not institution:
                print(f"⚠️ {student.name} ({student.email}) - Institution not found")
                continue
            
            # Generate unique student ID
            student_id = generate_student_id(db, student.institution_id)
            
            # Create enrolled student record
            enrolled_student = EnrolledStudent(
                institution_id=student.institution_id,
                student_id=student_id,
                student_name=student.name,
                student_email=student.email,
                grade="N/A",  # Default grade since we don't have this info
                status="active",
                application_data=None  # No application data for these legacy students
            )
            
            db.add(enrolled_student)
            synced_count += 1
            
            print(f"📝 Created enrollment for {student.name} ({student.email}) -> {institution.name}")
        
        if synced_count > 0:
            db.commit()
            print(f"\n✅ Successfully synced {synced_count} student(s)")
        else:
            print("\n✅ No students needed syncing - all data is consistent")
        
        # Show summary
        print("\n📊 Current Status:")
        total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
        enrolled_students = db.query(EnrolledStudent).count()
        print(f"Total Students in User table: {total_students}")
        print(f"Total Students in EnrolledStudent table: {enrolled_students}")
        
        # Show breakdown by institution
        institutions = db.query(User).filter(User.role == UserRole.INSTITUTION).all()
        for institution in institutions:
            enrolled_count = db.query(EnrolledStudent).filter(
                EnrolledStudent.institution_id == institution.id,
                EnrolledStudent.status == "active"
            ).count()
            print(f"  {institution.name}: {enrolled_count} enrolled students")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error syncing student data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🔄 Starting student data synchronization...")
    sync_student_enrollment()
    print("🎉 Synchronization complete!") 