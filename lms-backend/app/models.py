from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Text, Enum as SQLAlchemyEnum, Float, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from passlib.context import CryptContext

from .database import Base

# Password context for hashing and verification - support both argon2 and bcrypt
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Password helper functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Define user roles
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    INSTITUTION = "institution"

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=True)  # Email verification status
    name = Column(String(255), nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)
    
    # Additional fields
    profile_picture = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Institution-specific fields (only used when role is INSTITUTION)
    institution_name = Column(String(255), nullable=True)
    institution_website = Column(String(255), nullable=True)
    institution_address = Column(Text, nullable=True)
    
    # Instructor-specific fields (only used when role is INSTRUCTOR)
    specialization = Column(String(255), nullable=True)
    
    # Payment and Level System Fields (for instructors)
    red_mark = Column(Boolean, default=None, nullable=True)  # NULL = not purchased, True/False = purchased status
    level = Column(Integer, default=None, nullable=True)     # NULL = not purchased, 1-5 = purchased level
    
    # Student-specific fields (only used when role is STUDENT)
    student_id = Column(String(100), nullable=True, unique=True)
    
    # Institution profile fields (for institution role)
    cover_photo = Column(String(500), nullable=True)  # URL to cover photo
    cover_photo_position = Column(String(50), default="50% 50%")  # Background position for cropping
    cover_photo_zoom = Column(Integer, default=100)  # Zoom percentage for cropping
    profile_picture_position = Column(String(50), default="50% 50%")  # Background position for cropping
    profile_picture_zoom = Column(Integer, default=100)  # Zoom percentage for cropping
    description = Column(Text, nullable=True)  # Institution description
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    established_year = Column(Integer, nullable=True)
    
    # Rating system for institutions
    total_rating = Column(Integer, default=0)
    rating_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    
    # For multi-tenancy: students and instructors can belong to an institution
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Method to set password
    def set_password(self, password: str) -> None:
        """Hash and set the password."""
        self.hashed_password = get_password_hash(password)
    
    # Method to verify password
    def verify_password(self, password: str) -> bool:
        """Verify the provided password against the stored hashed password."""
        if not self.hashed_password:
            return False
        return verify_password(password, self.hashed_password)

# Institution model for additional institution details
class Institution(Base):
    __tablename__ = "institutions"
    
    id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    logo = Column(String(255), nullable=True)
    theme_color = Column(String(50), nullable=True)
    domain = Column(String(255), nullable=True, unique=True)
    max_students = Column(Integer, nullable=True)
    max_instructors = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Billing/subscription status
    subscription_tier = Column(String(50), nullable=True)
    subscription_status = Column(Boolean, default=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# Review model for institution reviews
class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewer_name = Column(String(255), nullable=False)
    reviewer_email = Column(String(255), nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# Course model for offered courses
class Course(Base):
    __tablename__ = "courses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(String(100), nullable=True)  # e.g., "6 months", "2 years"
    level = Column(String(50), nullable=True)  # e.g., "Beginner", "Intermediate", "Advanced"
    price = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# Post model for institution advertisements/posts
class Post(Base):
    __tablename__ = "posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    image_position = Column(String(50), default="50% 50%")  # For image cropping/positioning
    image_zoom = Column(Integer, default=100)  # For image zoom/scaling
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)  # For highlighting important posts
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# Institution form model for custom application forms
class InstitutionForm(Base):
    __tablename__ = "institution_forms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), default="student_application")  # form type
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# Form fields model for dynamic form structure
class FormField(Base):
    __tablename__ = "form_fields"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    form_id = Column(UUID(as_uuid=True), ForeignKey("institution_forms.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(255), nullable=False)  # e.g., "firstName", "email"
    field_label = Column(String(255), nullable=False)  # e.g., "First Name", "Email Address"
    field_type = Column(String(50), nullable=False)  # e.g., "text", "email", "select", "textarea"
    is_required = Column(Boolean, default=False)
    placeholder = Column(String(255), nullable=True)
    default_value = Column(Text, nullable=True)
    options = Column(Text, nullable=True)  # JSON string for select/radio options
    validation_rules = Column(Text, nullable=True)  # JSON string for validation
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

# Student applications model for storing submitted applications
class StudentApplication(Base):
    __tablename__ = "student_applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    form_id = Column(UUID(as_uuid=True), ForeignKey("institution_forms.id", ondelete="CASCADE"), nullable=False)
    student_email = Column(String(255), nullable=False)
    student_name = Column(String(255), nullable=True)
    status = Column(String(50), default="pending")  # pending, accepted, rejected
    submitted_data = Column(Text, nullable=False)  # JSON string of all form data
    submitted_at = Column(DateTime, server_default=func.now())
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    review_notes = Column(Text, nullable=True) 

# Enrolled students model for accepted students with generated student IDs
class EnrolledStudent(Base):
    __tablename__ = "enrolled_students"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String(20), nullable=False, unique=True)  # Auto-generated ID like STD7733
    student_name = Column(String(255), nullable=False)
    student_email = Column(String(255), nullable=False)
    grade = Column(String(50), nullable=True)  # Grade/Year level
    status = Column(String(50), default="active")  # active, graduated, suspended, etc.
    application_data = Column(Text, nullable=True)  # JSON string of original application data
    enrolled_at = Column(DateTime, server_default=func.now())
    graduated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Keep reference to original application
    original_application_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Add unique constraint on student_email to prevent race conditions
    __table_args__ = (
        UniqueConstraint('student_email', name='uq_enrolled_student_email'),
        Index('idx_enrolled_student_institution_id', 'institution_id'),
        Index('idx_enrolled_student_email', 'student_email'),
        Index('idx_enrolled_student_status', 'status'),
    ) 

# Instructor registrations model for pending instructor applications
class InstructorRegistration(Base):
    __tablename__ = "instructor_registrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic signup data
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)  # Store for later user creation
    
    # Wizard data
    bio = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    specialization = Column(String(255), nullable=True)
    education = Column(Text, nullable=True)  # Education background
    experience = Column(Text, nullable=True)  # Teaching/work experience
    certifications = Column(Text, nullable=True)  # Certifications and qualifications
    linkedin_profile = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    
    # Application status
    status = Column(String(50), default="pending")  # pending, approved, rejected
    submitted_at = Column(DateTime, server_default=func.now())
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    review_notes = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Add indexes for performance
    __table_args__ = (
        Index('idx_instructor_reg_email', 'email'),
        Index('idx_instructor_reg_status', 'status'),
        Index('idx_instructor_reg_submitted_at', 'submitted_at'),
    ) 

# New Instructor Profile Model for Editable Fields
class InstructorProfile(Base):
    __tablename__ = "instructor_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Editable Profile Fields
    skills = Column(Text, nullable=True)  # JSON string of skills: ["Python", "Machine Learning", ...]
    education = Column(Text, nullable=True)  # JSON string of education objects
    certifications = Column(Text, nullable=True)  # JSON string of certification objects
    custom_bio = Column(Text, nullable=True)  # Custom bio (overrides User.bio if set)
    languages = Column(Text, nullable=True)  # JSON string of spoken languages: ["English", "Spanish", ...]
    
    # Location (can be NULL if not purchased)
    location = Column(String(255), nullable=True)
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationship
    instructor = relationship("User", backref="instructor_profile")

# Red Mark Subscription model for tracking subscription status
class RedMarkSubscription(Base):
    __tablename__ = "red_mark_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Subscription details
    is_active = Column(Boolean, default=False, nullable=False)
    subscription_type = Column(String(50), nullable=True)  # 'monthly', 'annual'
    price_paid = Column(Float, nullable=True)  # Amount paid (e.g., 10.00)
    currency = Column(String(10), default="USD", nullable=True)  # Currency code
    
    # Dates
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    next_billing_date = Column(DateTime, nullable=True)
    
    # Billing and payment
    auto_renew = Column(Boolean, default=True, nullable=False)
    payment_method = Column(String(100), nullable=True)  # 'credit_card', 'paypal', etc.
    payment_reference = Column(String(255), nullable=True)  # Payment transaction ID
    
    # Status tracking
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    cancelled_at = Column(DateTime, nullable=True)
    
    # Relationship
    instructor = relationship("User", backref="red_mark_subscription")