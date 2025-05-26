#!/usr/bin/env python3
"""
Test script to create sample instructor registrations
"""

import asyncio
import json
from app.database import SessionLocal
from app.models import InstructorRegistration, get_password_hash
import uuid

def create_sample_registrations():
    """Create sample instructor registrations"""
    db = SessionLocal()
    try:
        # Sample instructor registrations
        registrations = [
            {
                "name": "Emma Rodriguez",
                "email": "emma.rodriguez@example.com",
                "password": "password123",
                "bio": "Passionate mathematics educator with 8+ years of experience in teaching advanced calculus and statistics.",
                "phone": "+1-555-0123",
                "specialization": "Advanced Mathematics",
                "education": "Ph.D. in Mathematics from MIT",
                "experience": "8 years",
                "certifications": "MIT Teaching Certificate\nAdvanced Mathematics Pedagogy Certificate\nStatistical Analysis Professional Certificate",
                "linkedin_profile": "https://linkedin.com/in/emma-rodriguez-math",
                "portfolio_url": "https://emmarodriguez-math.com"
            },
            {
                "name": "David Chen",
                "email": "david.chen@example.com", 
                "password": "password123",
                "bio": "Software engineer turned educator, passionate about making computer science accessible to all students.",
                "phone": "+1-555-0124",
                "specialization": "Computer Science",
                "education": "M.S. in Computer Science from Stanford",
                "experience": "6 years",
                "certifications": "Stanford Teaching Certificate\nPython Programming Professional\nWeb Development Specialist",
                "linkedin_profile": "https://linkedin.com/in/david-chen-cs",
                "portfolio_url": "https://davidchen-code.dev"
            },
            {
                "name": "Sophia Patel",
                "email": "sophia.patel@example.com",
                "password": "password123", 
                "bio": "Biology researcher and educator specializing in molecular biology and genetics education.",
                "phone": "+1-555-0125",
                "specialization": "Biology and Life Sciences",
                "education": "Ph.D. in Biology from Harvard",
                "experience": "10 years",
                "certifications": "Harvard Teaching Excellence Award\nMolecular Biology Research Certificate\nGenetics Education Specialist",
                "linkedin_profile": "https://linkedin.com/in/sophia-patel-bio",
                "portfolio_url": "https://sophiapatel-bio.com"
            }
        ]
        
        print("🔄 Creating sample instructor registrations...")
        
        for reg_data in registrations:
            # Check if registration already exists
            existing = db.query(InstructorRegistration).filter(
                InstructorRegistration.email == reg_data['email']
            ).first()
            
            if existing:
                print(f"✅ Registration for {reg_data['name']} already exists - skipping")
                continue
            
            # Create new registration
            registration = InstructorRegistration(
                id=uuid.uuid4(),
                name=reg_data['name'],
                email=reg_data['email'],
                password_hash=get_password_hash(reg_data['password']),
                bio=reg_data['bio'],
                phone=reg_data['phone'],
                specialization=reg_data['specialization'],
                education=reg_data['education'],
                experience=reg_data['experience'],
                certifications=reg_data['certifications'],
                linkedin_profile=reg_data['linkedin_profile'],
                portfolio_url=reg_data['portfolio_url'],
                status='pending'
            )
            
            db.add(registration)
            print(f"✅ Created registration for {reg_data['name']}")
        
        db.commit()
        print("🎉 Sample instructor registrations created successfully!")
        
        # Show summary
        total_registrations = db.query(InstructorRegistration).count()
        pending_registrations = db.query(InstructorRegistration).filter(
            InstructorRegistration.status == 'pending'
        ).count()
        
        print(f"\n📊 Summary:")
        print(f"   Total registrations: {total_registrations}")
        print(f"   Pending registrations: {pending_registrations}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating registrations: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_registrations() 