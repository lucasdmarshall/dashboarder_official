from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, UUID4
from datetime import datetime
from .models import UserRole

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole
    institution_id: Optional[UUID4] = None
    institution_name: Optional[str] = None
    institution_website: Optional[str] = None
    institution_address: Optional[str] = None
    specialization: Optional[str] = None
    student_id: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserRead(UserBase):
    id: UUID4
    is_active: bool
    bio: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[UserRole] = None
    institution_id: Optional[UUID4] = None
    institution_name: Optional[str] = None
    institution_website: Optional[str] = None
    institution_address: Optional[str] = None
    specialization: Optional[str] = None
    student_id: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    password: Optional[str] = None

# Login response schema
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

# Institution schemas - Updated for simplified admin management
class InstitutionBase(BaseModel):
    name: str
    email: EmailStr
    password: Optional[str] = None

class InstitutionCreate(InstitutionBase):
    password: str = Field(..., min_length=6)

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class InstitutionRead(BaseModel):
    id: UUID4
    name: str
    email: str
    password: str  # Unhashed password for display
    student_count: int = 0  # Dynamic count
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Institution Profile schemas
class InstitutionProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    cover_photo: Optional[str] = None
    cover_photo_position: Optional[str] = None
    cover_photo_zoom: Optional[int] = None
    profile_picture: Optional[str] = None
    profile_picture_position: Optional[str] = None
    profile_picture_zoom: Optional[int] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    established_year: Optional[int] = None

class InstitutionProfileRead(BaseModel):
    id: UUID4
    name: str
    email: str
    cover_photo: Optional[str] = None
    cover_photo_position: Optional[str] = None
    cover_photo_zoom: Optional[int] = None
    profile_picture: Optional[str] = None
    profile_picture_position: Optional[str] = None
    profile_picture_zoom: Optional[int] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    established_year: Optional[int] = None
    student_count: int = 0
    average_rating: float = 0.0
    rating_count: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

# Review schemas
class ReviewCreate(BaseModel):
    institution_id: UUID4
    reviewer_name: str
    reviewer_email: Optional[EmailStr] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewRead(BaseModel):
    id: UUID4
    reviewer_name: str
    rating: int
    comment: Optional[str] = None
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Course schemas
class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[str] = None
    image_url: Optional[str] = None

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class CourseRead(BaseModel):
    id: UUID4
    name: str
    description: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Post schemas
class PostBase(BaseModel):
    title: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    image_position: Optional[str] = "50% 50%"
    image_zoom: Optional[int] = 100
    is_featured: Optional[bool] = False

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    image_position: Optional[str] = None
    image_zoom: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None

class PostRead(PostBase):
    id: UUID4
    institution_id: UUID4
    institution_name: str
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Form schemas
class FormFieldCreate(BaseModel):
    field_name: str
    field_label: str
    field_type: str  # text, email, select, textarea, number, etc.
    is_required: bool = False
    placeholder: Optional[str] = None
    default_value: Optional[str] = None
    options: Optional[str] = None  # JSON string for select options
    validation_rules: Optional[str] = None
    display_order: int = 0

class FormFieldRead(FormFieldCreate):
    id: UUID4
    form_id: UUID4
    created_at: datetime
    
    class Config:
        from_attributes = True

class InstitutionFormCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "student_application"

class InstitutionFormUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class InstitutionFormRead(BaseModel):
    id: UUID4
    institution_id: UUID4
    name: str
    description: Optional[str] = None
    type: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class FormWithFieldsRead(BaseModel):
    form: InstitutionFormRead
    fields: List[FormFieldRead]

# Application schemas
class ApplicationSubmissionData(BaseModel):
    values: Dict[str, Any]  # Field name -> value mapping

class StudentApplicationCreate(BaseModel):
    student_email: str
    student_name: Optional[str] = None
    submitted_data: Dict[str, Any]

class StudentApplicationRead(BaseModel):
    id: UUID4
    institution_id: UUID4
    form_id: UUID4
    student_email: str
    student_name: Optional[str] = None
    status: str
    submitted_data: str  # JSON string
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[UUID4] = None
    review_notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: str  # "pending", "accepted", "rejected"
    review_notes: Optional[str] = None 

# Enrolled Student schemas
class EnrolledStudentCreate(BaseModel):
    student_name: str
    student_email: str
    grade: Optional[str] = None
    application_data: Optional[str] = None
    original_application_id: Optional[UUID4] = None

class EnrolledStudentUpdate(BaseModel):
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    grade: Optional[str] = None
    status: Optional[str] = None

class EnrolledStudentRead(BaseModel):
    id: UUID4
    institution_id: UUID4
    student_id: str
    student_name: str
    student_email: str
    grade: Optional[str] = None
    status: str
    application_data: Optional[str] = None
    enrolled_at: datetime
    graduated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    original_application_id: Optional[UUID4] = None
    
    class Config:
        from_attributes = True

# Instructor Registration schemas
class InstructorRegistrationCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    bio: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    certifications: Optional[str] = None
    linkedin_profile: Optional[str] = None
    portfolio_url: Optional[str] = None

class InstructorRegistrationRead(BaseModel):
    id: UUID4
    name: str
    email: str
    bio: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    certifications: Optional[str] = None
    linkedin_profile: Optional[str] = None
    portfolio_url: Optional[str] = None
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[UUID4] = None
    review_notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class InstructorRegistrationUpdate(BaseModel):
    status: str  # pending, approved, rejected
    review_notes: Optional[str] = None

# Approved Instructor (for View Tutors page)
class ApprovedInstructorRead(BaseModel):
    id: UUID4
    name: str
    email: str
    specialization: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    status: str = "Dashboarder Certified"  # Default status for approved instructors
    is_active: bool
    created_at: datetime
    
    # Subscription status fields
    has_red_mark: bool = False
    subscription_expires_soon: bool = False
    subscription_end_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Instructor Profile schemas (for editable fields)
class InstructorProfileCreate(BaseModel):
    skills: Optional[List[str]] = None
    education: Optional[List[Dict]] = None
    certifications: Optional[List[Dict]] = None
    custom_bio: Optional[str] = None
    location: Optional[str] = None

class InstructorProfileUpdate(BaseModel):
    skills: Optional[List[str]] = None
    education: Optional[List[Dict]] = None
    certifications: Optional[List[Dict]] = None
    custom_bio: Optional[str] = None
    location: Optional[str] = None

class InstructorProfileRead(BaseModel):
    id: UUID4
    instructor_id: UUID4
    skills: Optional[List[str]] = None
    education: Optional[List[Dict]] = None
    certifications: Optional[List[Dict]] = None
    custom_bio: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Red Mark Subscription schemas
class RedMarkSubscriptionCreate(BaseModel):
    subscription_type: str = Field(..., description="monthly or annual")
    price_paid: float = Field(..., description="Amount paid for subscription")
    currency: str = "USD"
    payment_method: str = Field(..., description="Payment method used")
    payment_reference: Optional[str] = None
    auto_renew: bool = True

class RedMarkSubscriptionRead(BaseModel):
    id: UUID4
    instructor_id: UUID4
    is_active: bool
    subscription_type: Optional[str] = None
    price_paid: Optional[float] = None
    currency: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    auto_renew: bool
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class RedMarkSubscriptionUpdate(BaseModel):
    is_active: Optional[bool] = None
    auto_renew: Optional[bool] = None

class SubscriptionStatusResponse(BaseModel):
    has_red_mark: bool
    is_active: bool
    subscription_type: Optional[str] = None
    end_date: Optional[datetime] = None
    expires_soon: bool = False
    days_until_expiry: Optional[int] = None 