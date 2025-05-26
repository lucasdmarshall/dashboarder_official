import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime

from .models import Base, User, UserRole, Institution
from .config import settings

# Create engine and session
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test users data
test_users = [
    # Admin users
    {
        "email": "admin1@dashboarder.com",
        "password": "Admin123!",
        "name": "Admin User One",
        "role": UserRole.ADMIN,
        "is_superuser": True,
    },
    {
        "email": "admin2@dashboarder.com",
        "password": "Admin456!",
        "name": "Admin User Two",
        "role": UserRole.ADMIN,
        "is_superuser": True,
    },
    # Institution users
    {
        "email": "institution1@dashboarder.com",
        "password": "Institution123!",
        "name": "University of Technology",
        "role": UserRole.INSTITUTION,
        "institution_name": "University of Technology",
        "institution_website": "https://uotech.edu",
        "institution_address": "123 Tech Avenue, Innovation City",
    },
    {
        "email": "institution2@dashboarder.com",
        "password": "Institution456!",
        "name": "Global Learning Academy",
        "role": UserRole.INSTITUTION,
        "institution_name": "Global Learning Academy",
        "institution_website": "https://globallearning.org",
        "institution_address": "456 Education Road, Knowledge Town",
    },
    # Instructor users
    {
        "email": "instructor1@dashboarder.com",
        "password": "Instructor123!",
        "name": "Dr. John Smith",
        "role": UserRole.INSTRUCTOR,
        "specialization": "Computer Science",
    },
    {
        "email": "instructor2@dashboarder.com",
        "password": "Instructor456!",
        "name": "Prof. Jane Doe",
        "role": UserRole.INSTRUCTOR,
        "specialization": "Mathematics",
    },
    # Student users
    {
        "email": "student1@dashboarder.com",
        "password": "Student123!",
        "name": "Alice Johnson",
        "role": UserRole.STUDENT,
        "student_id": "S2023001",
    },
    {
        "email": "student2@dashboarder.com",
        "password": "Student456!",
        "name": "Bob Williams",
        "role": UserRole.STUDENT,
        "student_id": "S2023002",
    },
]

# Institution details
institution_details = [
    {
        "email": "institution1@dashboarder.com",
        "name": "University of Technology",
        "logo": "https://example.com/uotech_logo.png",
        "theme_color": "#004d99",
        "domain": "uotech.edu",
        "max_students": 5000,
        "max_instructors": 500,
        "subscription_tier": "premium",
    },
    {
        "email": "institution2@dashboarder.com",
        "name": "Global Learning Academy",
        "logo": "https://example.com/gla_logo.png",
        "theme_color": "#7b1fa2",
        "domain": "globallearning.org",
        "max_students": 2000,
        "max_instructors": 200,
        "subscription_tier": "standard",
    },
]

def seed_database():
    # Create tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Insert test users
    session = SessionLocal()
    try:
        # First, create users
        for user_data in test_users:
            # Check if user already exists
            existing_user = session.query(User).filter(User.email == user_data["email"]).first()
            
            if not existing_user:
                # Hash the password
                hashed_password = pwd_context.hash(user_data["password"])
                
                # Create user
                user = User(
                    id=uuid.uuid4(),
                    email=user_data["email"],
                    hashed_password=hashed_password,
                    name=user_data["name"],
                    role=user_data["role"],
                    is_superuser=user_data.get("is_superuser", False),
                    is_active=True,
                    is_verified=True,
                    created_at=datetime.now(),
                )
                
                # Add role-specific fields
                if user.role == UserRole.INSTITUTION:
                    user.institution_name = user_data.get("institution_name")
                    user.institution_website = user_data.get("institution_website")
                    user.institution_address = user_data.get("institution_address")
                elif user.role == UserRole.INSTRUCTOR:
                    user.specialization = user_data.get("specialization")
                elif user.role == UserRole.STUDENT:
                    user.student_id = user_data.get("student_id")
                
                session.add(user)
        
        session.commit()
        
        # Next, create institution details
        for inst_data in institution_details:
            # Find user with matching email
            user = session.query(User).filter(User.email == inst_data["email"]).first()
            
            if user:
                # Create institution record
                institution = Institution(
                    id=user.id,
                    name=inst_data["name"],
                    logo=inst_data["logo"],
                    theme_color=inst_data["theme_color"],
                    domain=inst_data["domain"],
                    max_students=inst_data["max_students"],
                    max_instructors=inst_data["max_instructors"],
                    subscription_tier=inst_data["subscription_tier"],
                    is_active=True,
                    subscription_status=True,
                    created_at=datetime.now(),
                )
                
                session.add(institution)
        
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        session.close()
    
    print("Database seeded successfully!")

# Run the seed function
def main():
    seed_database()

if __name__ == "__main__":
    main() 