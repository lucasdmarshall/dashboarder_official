from fastapi import FastAPI, Depends, HTTPException, status, Form, Request, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import uuid
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import atexit

from .database import get_db, engine, Base
from .models import User, Institution, UserRole, Review, Course, Post, get_password_hash, verify_password, InstitutionForm, FormField, StudentApplication, EnrolledStudent, InstructorRegistration, InstructorProfile, RedMarkSubscription
from .schemas import (
    UserRead, UserCreate, UserUpdate, LoginResponse, InstitutionCreate, InstitutionRead, InstitutionUpdate,
    InstitutionProfileRead, InstitutionProfileUpdate, ReviewCreate, ReviewRead, CourseCreate, CourseRead, CourseUpdate,
    PostCreate, PostRead, PostUpdate, InstitutionFormCreate, InstitutionFormRead, InstitutionFormUpdate,
    FormFieldCreate, FormFieldRead, FormWithFieldsRead, StudentApplicationCreate, StudentApplicationRead,
    ApplicationSubmissionData, ApplicationStatusUpdate, EnrolledStudentCreate, EnrolledStudentUpdate, EnrolledStudentRead,
    InstructorRegistrationCreate, InstructorRegistrationRead, InstructorRegistrationUpdate, ApprovedInstructorRead,
    InstructorProfileCreate, InstructorProfileUpdate, InstructorProfileRead, RedMarkSubscriptionCreate, 
    RedMarkSubscriptionRead, RedMarkSubscriptionUpdate, SubscriptionStatusResponse
)
from .auth import (
    create_access_token, current_active_user, current_admin_user, 
    current_institution_user, current_instructor_user, current_student_user
)
from .config import settings
from .cleanup_service import cleanup_old_registrations_safe

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize scheduler
scheduler = BackgroundScheduler()

# Utility function to generate random student ID
def generate_student_id(db: Session, institution_id: uuid.UUID) -> str:
    """Generate a unique random student ID for the institution"""
    import random
    import string
    
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

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dashboarder LMS API")

# Configure CORS more explicitly for development
frontend_url = "http://localhost:3001"  # React development server
cors_origins = [
    frontend_url,
    "http://localhost:3000",  # Alternative React port
    "http://localhost:3010",  # Our simple HTTP server
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3010",
    "http://localhost:8000",  # Other potential ports
    "http://localhost:8080",
    "null"  # Allow file:// protocol origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["Content-Type", "Authorization", "Accept"],
    max_age=86400,  # 24 hours
)

# Setup cleanup scheduler
@app.on_event("startup")
async def startup_event():
    """Start the background scheduler when the application starts"""
    logger.info("Starting instructor registration cleanup scheduler...")
    
    # Add cleanup job to run every hour
    scheduler.add_job(
        func=cleanup_old_registrations_safe,
        trigger=IntervalTrigger(hours=1),
        id='cleanup_instructor_registrations',
        name='Cleanup old instructor registrations',
        replace_existing=True,
        max_instances=1
    )
    
    # Start the scheduler
    scheduler.start()
    logger.info("Cleanup scheduler started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop the background scheduler when the application shuts down"""
    logger.info("Stopping instructor registration cleanup scheduler...")
    scheduler.shutdown()
    logger.info("Cleanup scheduler stopped")

# Manual cleanup endpoint for testing/admin use
@app.post("/api/admin/cleanup-registrations", tags=["admin"])
def manual_cleanup_registrations(
    admin_user: User = Depends(current_admin_user)
):
    """Manually trigger cleanup of old instructor registrations - admin only"""
    try:
        cleanup_old_registrations_safe()
        return {"message": "Cleanup completed successfully"}
    except Exception as e:
        logger.error(f"Manual cleanup failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cleanup failed: {str(e)}",
        )

# Custom exception handler
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP exception: {exc.detail}")
    return await http_exception_handler(request, exc)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Dashboarder LMS API"}

# Health check endpoint with CORS info
@app.get("/api/health")
def health_check(request: Request):
    # Log headers for debugging
    headers = {k: v for k, v in request.headers.items()}
    logger.info(f"Headers: {headers}")
    
    return {
        "status": "ok", 
        "cors_origins": cors_origins,
        "request_headers": headers
    }

# Test endpoint for CORS
@app.get("/api/test-cors")
def test_cors():
    return {"message": "CORS is working!"}

# Login endpoint
@app.post("/api/auth/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find the user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserRead.from_orm(user)
    }

# Public registration endpoint
@app.post("/api/auth/register", tags=["auth"])
def register(
    user_create: UserCreate,
    db: Session = Depends(get_db)
):
    """Public registration for students and instructors"""
    try:
        # Check if user with this email already exists
        existing_user = db.query(User).filter(User.email == user_create.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )
        
        # Check if instructor registration with this email already exists
        if user_create.role == UserRole.INSTRUCTOR:
            existing_instructor_reg = db.query(InstructorRegistration).filter(
                InstructorRegistration.email == user_create.email
            ).first()
            if existing_instructor_reg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Instructor application with this email already exists",
                )
        
        # Validate role (only allow student and instructor for public registration)
        if user_create.role not in [UserRole.STUDENT, UserRole.INSTRUCTOR]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only students and instructors can register through this endpoint",
            )
        
        if user_create.role == UserRole.INSTRUCTOR:
            # For instructors, create a registration record instead of user account
            instructor_registration = InstructorRegistration(
                id=uuid.uuid4(),
                name=user_create.name,
                email=user_create.email,
                password_hash=get_password_hash(user_create.password),
                status="pending"
            )
            
            db.add(instructor_registration)
            db.commit()
            db.refresh(instructor_registration)
            
            # Return a simple response for instructor registration
            return {
                "success": True,
                "message": "Instructor registration submitted successfully",
                "registration_id": str(instructor_registration.id),
                "status": "pending_approval",
                "next_step": "complete_wizard"
            }
        else:
            # For students, create user account as before
            user = User(
                id=uuid.uuid4(),
                name=user_create.name,
                email=user_create.email,
                role=user_create.role,
                is_active=True,
                is_verified=True  # Set as verified for now
            )
            user.set_password(user_create.password)
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Generate access token for automatic login
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": str(user.id)},
                expires_delta=access_token_expires,
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserRead.from_orm(user)
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}",
        )

# Create user endpoint (only for admins)
@app.post("/api/users/create", response_model=UserRead, tags=["users"])
def create_user(
    user_create: UserCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    try:
        # Check if user with this email already exists
        existing_user = db.query(User).filter(User.email == user_create.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )
        
        # Create new user
        user = User(
            id=uuid.uuid4(),
            name=user_create.name,
            email=user_create.email,
            role=user_create.role,
            is_active=True
        )
        user.set_password(user_create.password)
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

# Get current user profile - standard endpoint
@app.get("/api/users/me", response_model=UserRead, tags=["users"])
def get_current_user(user: User = Depends(current_active_user)):
    return user

# Update current user profile
@app.put("/api/users/me", response_model=UserRead, tags=["users"])
def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update current user's profile"""
    try:
        # Get the user from the current session to avoid session issues
        current_user = db.query(User).filter(User.id == user.id).first()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        # Update fields if provided
        if user_update.name is not None:
            current_user.name = user_update.name
        if user_update.email is not None:
            # Check if new email already exists
            existing_user = db.query(User).filter(
                User.email == user_update.email,
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists",
                )
            current_user.email = user_update.email
        if user_update.bio is not None:
            current_user.bio = user_update.bio
        if user_update.phone is not None:
            current_user.phone = user_update.phone
        if user_update.specialization is not None:
            current_user.specialization = user_update.specialization
        # Add support for address field
        if hasattr(user_update, 'address') and user_update.address is not None:
            current_user.address = user_update.address
        
        db.commit()
        db.refresh(current_user)
        
        return current_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user profile: {str(e)}",
        )

# Get current user profile (alternative endpoint)
@app.get("/api/users/me/profile", response_model=UserRead, tags=["users"])
def get_user_profile(user: User = Depends(current_active_user)):
    return user

# Get current institution profile (for institution users)
@app.get("/api/institutions/me", tags=["institutions"])
def get_my_institution_profile(
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Get current institution's own profile - for institution users"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can access this endpoint",
        )
    
    try:
        # Count enrolled students belonging to this institution
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == user.id,
            EnrolledStudent.status == "active"
        ).count()
        
        return {
            "institution": InstitutionRead(
                id=user.id,
                name=user.name,
                email=user.email,
                password="[Password Set]",  # Don't show actual password
                student_count=student_count,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
        }
    except Exception as e:
        logger.error(f"Error fetching institution profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching institution profile: {str(e)}",
        )

# Institution Profile endpoints - MOVED BEFORE parameterized routes to avoid conflicts
@app.get("/api/institutions/{institution_id}/profile", response_model=InstitutionProfileRead, tags=["institution-profile"])
def get_institution_profile(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get institution profile - public endpoint"""
    try:
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Count enrolled students belonging to this institution
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution.id,
            EnrolledStudent.status == "active"
        ).count()
        
        return InstitutionProfileRead(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            cover_photo=institution.cover_photo,
            cover_photo_position=institution.cover_photo_position,
            cover_photo_zoom=institution.cover_photo_zoom,
            profile_picture=institution.profile_picture,
            profile_picture_position=institution.profile_picture_position,
            profile_picture_zoom=institution.profile_picture_zoom,
            description=institution.description,
            phone=institution.phone,
            address=institution.address,
            website=institution.website,
            established_year=institution.established_year,
            student_count=student_count,
            average_rating=institution.average_rating,
            rating_count=institution.rating_count,
            created_at=institution.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching institution profile: {str(e)}",
        )

@app.put("/api/institutions/profile", response_model=InstitutionProfileRead, tags=["institution-profile"])
def update_institution_profile(
    profile_data: InstitutionProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update institution profile - for institution users only"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can update their profile",
        )
    
    try:
        # Get the user from the current session to avoid session issues
        current_user = db.query(User).filter(User.id == user.id).first()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        # Update fields if provided
        if profile_data.name is not None:
            current_user.name = profile_data.name
        if profile_data.email is not None:
            # Check if new email already exists
            existing_user = db.query(User).filter(
                User.email == profile_data.email,
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists",
                )
            current_user.email = profile_data.email
        if profile_data.cover_photo is not None:
            current_user.cover_photo = profile_data.cover_photo
        if profile_data.cover_photo_position is not None:
            current_user.cover_photo_position = profile_data.cover_photo_position
        if profile_data.cover_photo_zoom is not None:
            current_user.cover_photo_zoom = profile_data.cover_photo_zoom
        if profile_data.profile_picture is not None:
            current_user.profile_picture = profile_data.profile_picture
        if profile_data.profile_picture_position is not None:
            current_user.profile_picture_position = profile_data.profile_picture_position
        if profile_data.profile_picture_zoom is not None:
            current_user.profile_picture_zoom = profile_data.profile_picture_zoom
        if profile_data.description is not None:
            current_user.description = profile_data.description
        if profile_data.phone is not None:
            current_user.phone = profile_data.phone
        if profile_data.address is not None:
            current_user.address = profile_data.address
        if profile_data.website is not None:
            current_user.website = profile_data.website
        if profile_data.established_year is not None:
            current_user.established_year = profile_data.established_year
        
        db.commit()
        db.refresh(current_user)
        
        # Count enrolled students belonging to this institution
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == current_user.id,
            EnrolledStudent.status == "active"
        ).count()
        
        return InstitutionProfileRead(
            id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            cover_photo=current_user.cover_photo,
            cover_photo_position=current_user.cover_photo_position,
            cover_photo_zoom=current_user.cover_photo_zoom,
            profile_picture=current_user.profile_picture,
            profile_picture_position=current_user.profile_picture_position,
            profile_picture_zoom=current_user.profile_picture_zoom,
            description=current_user.description,
            phone=current_user.phone,
            address=current_user.address,
            website=current_user.website,
            established_year=current_user.established_year,
            student_count=student_count,
            average_rating=current_user.average_rating,
            rating_count=current_user.rating_count,
            created_at=current_user.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating institution profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating institution profile: {str(e)}",
        )

# Institution management endpoints for admin
@app.get("/api/institutions", response_model=List[InstitutionRead], tags=["institutions"])
def get_all_institutions(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get all institutions - admin only"""
    try:
        # Get all users with INSTITUTION role
        institutions = db.query(User).filter(User.role == UserRole.INSTITUTION).all()
        
        # Convert to InstitutionRead format with student count
        result = []
        for inst in institutions:
            # Count enrolled students belonging to this institution
            student_count = db.query(EnrolledStudent).filter(
                EnrolledStudent.institution_id == inst.id,
                EnrolledStudent.status == "active"
            ).count()
            
            institution_data = InstitutionRead(
                id=inst.id,
                name=inst.name,
                email=inst.email,
                password="[Password Set]",  # Can't show actual password for existing records
                student_count=student_count,
                created_at=inst.created_at,
                updated_at=inst.updated_at
            )
            result.append(institution_data)
        
        return result
    except Exception as e:
        logger.error(f"Error fetching institutions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching institutions: {str(e)}",
        )

@app.get("/api/institutions/{institution_id}", response_model=InstitutionRead, tags=["institutions"])
def get_institution(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get a specific institution by ID - admin only"""
    try:
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Count enrolled students belonging to this institution
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution.id,
            EnrolledStudent.status == "active"
        ).count()
        
        return InstitutionRead(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            password="[Password Set]",  # Can't show actual password for existing records
            student_count=student_count,
            created_at=institution.created_at,
            updated_at=institution.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching institution: {str(e)}",
        )

@app.post("/api/institutions/create", response_model=InstitutionRead, tags=["institutions"])
def create_institution_admin(
    institution_data: InstitutionCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Create a new institution - admin only"""
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == institution_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )
        
        # Hash password
        hashed_password = get_password_hash(institution_data.password)
        
        # Create institution user
        institution = User(
            id=uuid.uuid4(),
            name=institution_data.name,
            email=institution_data.email,
            hashed_password=hashed_password,
            role=UserRole.INSTITUTION,
            is_active=True,
            is_verified=True
        )
        
        db.add(institution)
        db.commit()
        db.refresh(institution)
        
        return InstitutionRead(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            password=institution_data.password,  # Return the original unhashed password
            student_count=0,  # New institution starts with 0 students
            created_at=institution.created_at,
            updated_at=institution.updated_at
        )
    except HTTPException:
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating institution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating institution: {str(e)}",
        )

@app.put("/api/institutions/{institution_id}", response_model=InstitutionRead, tags=["institutions"])
def update_institution(
    institution_id: uuid.UUID,
    institution_data: InstitutionUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Update an institution - admin only"""
    try:
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Update fields if provided
        if institution_data.name is not None:
            institution.name = institution_data.name
        if institution_data.email is not None:
            # Check if new email already exists
            existing_user = db.query(User).filter(
                User.email == institution_data.email,
                User.id != institution_id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists",
                )
            institution.email = institution_data.email
        if institution_data.password is not None:
            # Only update password if it's provided and not empty
            if institution_data.password.strip():
                if len(institution_data.password) < 6:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Password must be at least 6 characters long",
                    )
                institution.hashed_password = get_password_hash(institution_data.password)
        
        db.commit()
        db.refresh(institution)
        
        # Count students belonging to this institution
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution.id,
            EnrolledStudent.status == "active"
        ).count()
        
        return InstitutionRead(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            password=institution_data.password if institution_data.password else "[Password Set]",
            student_count=student_count,
            created_at=institution.created_at,
            updated_at=institution.updated_at
        )
    except HTTPException:
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating institution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating institution: {str(e)}",
        )

@app.delete("/api/institutions/{institution_id}", tags=["institutions"])
def delete_institution(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Delete an institution - admin only"""
    try:
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Check if institution has students
        student_count = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution.id,
            EnrolledStudent.status == "active"
        ).count()
        
        if student_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete institution with {student_count} students. Please reassign or remove students first.",
            )
        
        db.delete(institution)
        db.commit()
        
        return {"message": "Institution deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting institution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting institution: {str(e)}",
        )

# Review endpoints
@app.get("/api/institutions/{institution_id}/reviews", response_model=List[ReviewRead], tags=["reviews"])
def get_institution_reviews(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get all reviews for an institution"""
    try:
        reviews = db.query(Review).filter(
            Review.institution_id == institution_id
        ).order_by(Review.created_at.desc()).all()
        
        return reviews
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching reviews: {str(e)}",
        )

@app.post("/api/reviews", response_model=ReviewRead, tags=["reviews"])
def create_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
):
    """Create a new review"""
    try:
        # Verify institution exists
        institution = db.query(User).filter(
            User.id == review_data.institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Create review
        review = Review(
            institution_id=review_data.institution_id,
            reviewer_name=review_data.reviewer_name,
            reviewer_email=review_data.reviewer_email,
            rating=review_data.rating,
            comment=review_data.comment
        )
        
        db.add(review)
        
        # Update institution's rating
        institution.total_rating += review_data.rating
        institution.rating_count += 1
        institution.average_rating = institution.total_rating / institution.rating_count
        
        db.commit()
        db.refresh(review)
        
        return review
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating review: {str(e)}",
        )

# Course endpoints
@app.get("/api/institutions/{institution_id}/courses", response_model=List[CourseRead], tags=["courses"])
def get_institution_courses(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get all courses offered by an institution"""
    try:
        courses = db.query(Course).filter(
            Course.institution_id == institution_id,
            Course.is_active == True
        ).order_by(Course.created_at.desc()).all()
        
        return courses
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching courses: {str(e)}",
        )

@app.post("/api/courses", response_model=CourseRead, tags=["courses"])
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Create a new course - for institution users"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can create courses",
        )
    
    try:
        course = Course(
            institution_id=user.id,
            name=course_data.name,
            description=course_data.description,
            duration=course_data.duration,
            level=course_data.level,
            price=course_data.price,
            image_url=course_data.image_url
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        return course
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating course: {str(e)}",
        )

@app.put("/api/courses/{course_id}", response_model=CourseRead, tags=["courses"])
def update_course(
    course_id: uuid.UUID,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update a course - for institution users"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can update courses",
        )
    
    try:
        course = db.query(Course).filter(
            Course.id == course_id,
            Course.institution_id == user.id
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        
        # Update fields if provided
        if course_data.name is not None:
            course.name = course_data.name
        if course_data.description is not None:
            course.description = course_data.description
        if course_data.duration is not None:
            course.duration = course_data.duration
        if course_data.level is not None:
            course.level = course_data.level
        if course_data.price is not None:
            course.price = course_data.price
        if course_data.image_url is not None:
            course.image_url = course_data.image_url
        if course_data.is_active is not None:
            course.is_active = course_data.is_active
        
        db.commit()
        db.refresh(course)
        
        return course
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating course: {str(e)}",
        )

@app.delete("/api/courses/{course_id}", tags=["courses"])
def delete_course(
    course_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Delete a course - for institution users"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can delete courses",
        )
    
    try:
        course = db.query(Course).filter(
            Course.id == course_id,
            Course.institution_id == user.id
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        
        db.delete(course)
        db.commit()
        
        return {"message": "Course deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting course: {str(e)}",
        )

# Post endpoints
@app.get("/api/posts", response_model=List[PostRead], tags=["posts"])
def get_all_posts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50
):
    """Get all active posts for the advertisement feed - public endpoint"""
    try:
        posts = db.query(Post).join(User).filter(
            Post.is_active == True,
            User.role == UserRole.INSTITUTION
        ).order_by(Post.is_featured.desc(), Post.created_at.desc()).offset(skip).limit(limit).all()
        
        # Add institution name to each post
        result = []
        for post in posts:
            institution = db.query(User).filter(User.id == post.institution_id).first()
            post_data = PostRead(
                id=post.id,
                institution_id=post.institution_id,
                institution_name=institution.name if institution else "Unknown Institution",
                title=post.title,
                content=post.content,
                image_url=post.image_url,
                image_position=post.image_position,
                image_zoom=post.image_zoom,
                is_active=post.is_active,
                is_featured=post.is_featured,
                created_at=post.created_at,
                updated_at=post.updated_at
            )
            result.append(post_data)
        
        return result
    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching posts: {str(e)}",
        )

@app.get("/api/institutions/{institution_id}/posts", response_model=List[PostRead], tags=["posts"])
def get_institution_posts(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get all posts from a specific institution"""
    try:
        posts = db.query(Post).filter(
            Post.institution_id == institution_id,
            Post.is_active == True
        ).order_by(Post.created_at.desc()).all()
        
        institution = db.query(User).filter(User.id == institution_id).first()
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        result = []
        for post in posts:
            post_data = PostRead(
                id=post.id,
                institution_id=post.institution_id,
                institution_name=institution.name,
                title=post.title,
                content=post.content,
                image_url=post.image_url,
                image_position=post.image_position,
                image_zoom=post.image_zoom,
                is_active=post.is_active,
                is_featured=post.is_featured,
                created_at=post.created_at,
                updated_at=post.updated_at
            )
            result.append(post_data)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching institution posts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching institution posts: {str(e)}",
        )

@app.post("/api/posts", response_model=PostRead, tags=["posts"])
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Create a new post - for institution users only"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can create posts",
        )
    
    try:
        post = Post(
            institution_id=user.id,
            title=post_data.title,
            content=post_data.content,
            image_url=post_data.image_url,
            image_position=post_data.image_position or "50% 50%",
            image_zoom=post_data.image_zoom or 100,
            is_featured=post_data.is_featured or False
        )
        
        db.add(post)
        db.commit()
        db.refresh(post)
        
        # Return with institution name
        institution = db.query(User).filter(User.id == user.id).first()
        return PostRead(
            id=post.id,
            institution_id=post.institution_id,
            institution_name=institution.name,
            title=post.title,
            content=post.content,
            image_url=post.image_url,
            image_position=post.image_position,
            image_zoom=post.image_zoom,
            is_active=post.is_active,
            is_featured=post.is_featured,
            created_at=post.created_at,
            updated_at=post.updated_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating post: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating post: {str(e)}",
        )

@app.put("/api/posts/{post_id}", response_model=PostRead, tags=["posts"])
def update_post(
    post_id: uuid.UUID,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update a post - for institution users only"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can update posts",
        )
    
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.institution_id == user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )
        
        # Update fields if provided
        if post_data.title is not None:
            post.title = post_data.title
        if post_data.content is not None:
            post.content = post_data.content
        if post_data.image_url is not None:
            post.image_url = post_data.image_url
        if post_data.image_position is not None:
            post.image_position = post_data.image_position
        if post_data.image_zoom is not None:
            post.image_zoom = post_data.image_zoom
        if post_data.is_active is not None:
            post.is_active = post_data.is_active
        if post_data.is_featured is not None:
            post.is_featured = post_data.is_featured
        
        db.commit()
        db.refresh(post)
        
        # Return with institution name
        institution = db.query(User).filter(User.id == user.id).first()
        return PostRead(
            id=post.id,
            institution_id=post.institution_id,
            institution_name=institution.name,
            title=post.title,
            content=post.content,
            image_url=post.image_url,
            image_position=post.image_position,
            image_zoom=post.image_zoom,
            is_active=post.is_active,
            is_featured=post.is_featured,
            created_at=post.created_at,
            updated_at=post.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating post: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating post: {str(e)}",
        )

@app.delete("/api/posts/{post_id}", tags=["posts"])
def delete_post(
    post_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Delete a post - for institution users only"""
    if user.role != UserRole.INSTITUTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can delete posts",
        )
    
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.institution_id == user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )
        
        db.delete(post)
        db.commit()
        
        return {"message": "Post deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting post: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting post: {str(e)}",
        )

# Form Management API Endpoints

# Get all forms for an institution (with authentication)
@app.get("/api/forms/{institution_id}", response_model=List[InstitutionFormRead], tags=["forms"])
def get_institution_forms(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Get all forms for an institution - requires authentication"""
    # Verify user has access to this institution's forms
    if user.role != UserRole.ADMIN and user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    try:
        forms = db.query(InstitutionForm).filter(
            InstitutionForm.institution_id == institution_id,
            InstitutionForm.is_active == True
        ).order_by(InstitutionForm.created_at.desc()).all()
        
        return forms
    except Exception as e:
        logger.error(f"Error fetching forms: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching forms: {str(e)}",
        )

# Public endpoint to get forms (for students applying)
@app.get("/api/public/forms/{institution_id}")
def get_public_institution_forms(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get public forms for an institution - no authentication required"""
    try:
        forms = db.query(InstitutionForm).filter(
            InstitutionForm.institution_id == institution_id,
            InstitutionForm.is_active == True
        ).order_by(InstitutionForm.created_at.desc()).all()
        
        return {"forms": forms}
    except Exception as e:
        logger.error(f"Error fetching public forms: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching public forms: {str(e)}",
        )

# Get specific form with fields (with authentication)
@app.get("/api/forms/{institution_id}/{form_id}", response_model=FormWithFieldsRead, tags=["forms"])
def get_form_with_fields(
    institution_id: uuid.UUID,
    form_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Get a specific form with its fields - requires authentication"""
    # Verify user has access to this institution's forms
    if user.role != UserRole.ADMIN and user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    try:
        form = db.query(InstitutionForm).filter(
            InstitutionForm.id == form_id,
            InstitutionForm.institution_id == institution_id
        ).first()
        
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )
        
        fields = db.query(FormField).filter(
            FormField.form_id == form_id
        ).order_by(FormField.display_order, FormField.created_at).all()
        
        return FormWithFieldsRead(form=form, fields=fields)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching form: {str(e)}",
        )

# Public endpoint to get specific form with fields (for student applications)
@app.get("/api/public/forms/{institution_id}/{form_id}", response_model=FormWithFieldsRead, tags=["public-forms"])
def get_public_form_with_fields(
    institution_id: uuid.UUID,
    form_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get a specific form with its fields - public endpoint for applications"""
    try:
        form = db.query(InstitutionForm).filter(
            InstitutionForm.id == form_id,
            InstitutionForm.institution_id == institution_id,
            InstitutionForm.is_active == True
        ).first()
        
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )
        
        fields = db.query(FormField).filter(
            FormField.form_id == form_id
        ).order_by(FormField.display_order, FormField.created_at).all()
        
        return FormWithFieldsRead(form=form, fields=fields)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching public form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching public form: {str(e)}",
        )

# Check if a student has already applied to an institution
@app.get("/api/public/check-application/{institution_id}", tags=["public-forms"])
def check_application_status(
    institution_id: uuid.UUID,
    email: str,
    db: Session = Depends(get_db)
):
    """Check if a student has already applied to an institution - public endpoint"""
    try:
        # Verify institution exists
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Check if there's an existing application from this email to this institution
        existing_application = db.query(StudentApplication).filter(
            StudentApplication.institution_id == institution_id,
            StudentApplication.student_email == email.lower().strip()
        ).first()
        
        return {
            "hasApplied": existing_application is not None,
            "applicationId": str(existing_application.id) if existing_application else None,
            "status": existing_application.status if existing_application else None,
            "submittedAt": existing_application.submitted_at.isoformat() if existing_application else None
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking application status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking application status: {str(e)}",
        )

# Check application status for authenticated user
@app.get("/api/check-application/{institution_id}", tags=["applications"])
def check_authenticated_application_status(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Check if the current authenticated user has already applied to an institution"""
    try:
        # Verify institution exists
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        # Check if there's an existing application from this user's email to this institution
        existing_application = db.query(StudentApplication).filter(
            StudentApplication.institution_id == institution_id,
            StudentApplication.student_email == user.email.lower().strip()
        ).first()
        
        return {
            "hasApplied": existing_application is not None,
            "applicationId": str(existing_application.id) if existing_application else None,
            "status": existing_application.status if existing_application else None,
            "submittedAt": existing_application.submitted_at.isoformat() if existing_application else None,
            "userEmail": user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking authenticated application status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking authenticated application status: {str(e)}",
        )

# Public endpoint to create form (used by frontend form builder)
@app.post("/api/public/forms/{institution_id}")
def create_public_form(
    institution_id: uuid.UUID,
    form_data: InstitutionFormCreate,
    db: Session = Depends(get_db)
):
    """Create a new form - public endpoint (for frontend compatibility)"""
    try:
        # Verify institution exists
        institution = db.query(User).filter(
            User.id == institution_id,
            User.role == UserRole.INSTITUTION
        ).first()
        
        if not institution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Institution not found",
            )
        
        form = InstitutionForm(
            institution_id=institution_id,
            name=form_data.name,
            description=form_data.description,
            type=form_data.type
        )
        
        db.add(form)
        db.commit()
        db.refresh(form)
        
        # Return form with empty fields initially
        return {"form": form, "fields": []}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating public form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating public form: {str(e)}",
        )

# Public endpoint to add form fields (for frontend compatibility)
@app.post("/api/public/forms/{institution_id}/{form_id}/fields")
def add_public_form_fields(
    institution_id: uuid.UUID,
    form_id: uuid.UUID,
    fields_data: List[FormFieldCreate],
    db: Session = Depends(get_db)
):
    """Add fields to a form - public endpoint (for frontend compatibility)"""
    try:
        # Verify form exists and belongs to institution
        form = db.query(InstitutionForm).filter(
            InstitutionForm.id == form_id,
            InstitutionForm.institution_id == institution_id
        ).first()
        
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )
        
        # Clear existing fields first
        db.query(FormField).filter(FormField.form_id == form_id).delete()
        
        # Add new fields
        created_fields = []
        for field_data in fields_data:
            field = FormField(
                form_id=form_id,
                field_name=field_data.field_name,
                field_label=field_data.field_label,
                field_type=field_data.field_type,
                is_required=field_data.is_required,
                placeholder=field_data.placeholder,
                default_value=field_data.default_value,
                options=field_data.options,
                validation_rules=field_data.validation_rules,
                display_order=field_data.display_order
            )
            db.add(field)
            created_fields.append(field)
        
        db.commit()
        
        # Refresh all fields
        for field in created_fields:
            db.refresh(field)
        
        return created_fields
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error adding public form fields: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding public form fields: {str(e)}",
        )

# Get all applications for an institution
@app.get("/api/institutions/{institution_id}/applications")
def get_institution_applications(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Get all applications for an institution - institution users only"""
    if user.role != UserRole.INSTITUTION or user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can view their applications",
        )
    
    try:
        applications = db.query(StudentApplication).filter(
            StudentApplication.institution_id == institution_id
        ).order_by(StudentApplication.submitted_at.desc()).all()
        
        return applications
    except Exception as e:
        logger.error(f"Error fetching applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching applications: {str(e)}",
        )

# Update application status (Accept) or delete application (Reject)
@app.put("/api/institutions/{institution_id}/applications/{application_id}/status")
def update_application_status(
    institution_id: uuid.UUID,
    application_id: uuid.UUID,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update application status - institution users only. If status is 'rejected', the application is deleted."""
    if user.role != UserRole.INSTITUTION or user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can update their applications",
        )
    
    try:
        application = db.query(StudentApplication).filter(
            StudentApplication.id == application_id,
            StudentApplication.institution_id == institution_id
        ).first()
        
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )
        
        if status_update.status == "rejected":
            # Delete the application instead of updating status
            db.delete(application)
            db.commit()
            return {"message": "Application rejected and deleted successfully"}
        elif status_update.status == "accepted":
            # IMPLEMENT ONE-STUDENT-ONE-INSTITUTION POLICY WITH RACE CONDITION PROTECTION
            
            # Use explicit transaction with serializable isolation for race condition protection
            try:
                # Start a new transaction with higher isolation level
                db.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
                
                # First, check if student is already enrolled somewhere else (with SELECT FOR UPDATE)
                existing_enrollment = db.query(EnrolledStudent).filter(
                    EnrolledStudent.student_email == application.student_email
                ).with_for_update().first()
                
                if existing_enrollment:
                    enrolled_institution = db.query(User).filter(User.id == existing_enrollment.institution_id).first()
                    db.rollback()
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Student is already enrolled in {enrolled_institution.name if enrolled_institution else 'another institution'}. Cannot accept application.",
                    )
                
                # Double-check that this application still exists and belongs to this institution
                current_application = db.query(StudentApplication).filter(
                    StudentApplication.id == application_id,
                    StudentApplication.institution_id == institution_id
                ).with_for_update().first()
                
                if not current_application:
                    db.rollback()
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Application no longer exists (may have been processed by another institution)",
                    )
                
                # Create enrolled student record
                import json
                
                # Generate unique student ID
                student_id = generate_student_id(db, institution_id)
                
                # Parse the submitted data to extract grade/year if available
                submitted_data = {}
                try:
                    submitted_data = json.loads(current_application.submitted_data)
                except:
                    submitted_data = {}
                
                # Extract grade from various possible field names
                grade = (
                    submitted_data.get('grade') or 
                    submitted_data.get('year') or
                    submitted_data.get('level') or
                    submitted_data.get('class') or
                    submitted_data.get('Grade') or
                    submitted_data.get('Year') or
                    submitted_data.get('Level') or
                    submitted_data.get('Class') or
                    "N/A"
                )
                
                # Create enrolled student record
                enrolled_student = EnrolledStudent(
                    institution_id=institution_id,
                    student_id=student_id,
                    student_name=current_application.student_name or "Unknown",
                    student_email=current_application.student_email,
                    grade=str(grade),
                    status="active",
                    application_data=current_application.submitted_data,
                    original_application_id=current_application.id
                )
                
                db.add(enrolled_student)
                
                # UPDATE USER.INSTITUTION_ID to match the accepted institution
                student_user = db.query(User).filter(
                    User.email == current_application.student_email,
                    User.role == UserRole.STUDENT
                ).with_for_update().first()
                
                if student_user:
                    student_user.institution_id = institution_id
                    logger.info(f"Updated student {student_user.name} institution_id to {institution_id}")
                
                # DELETE ALL APPLICATIONS FOR THIS STUDENT (including the accepted one)
                all_student_applications = db.query(StudentApplication).filter(
                    StudentApplication.student_email == current_application.student_email
                ).all()
                
                deleted_apps_count = 0
                deleted_institutions = []
                
                for app in all_student_applications:
                    # Get institution name for logging
                    app_institution = db.query(User).filter(User.id == app.institution_id).first()
                    if app_institution:
                        deleted_institutions.append(app_institution.name)
                    db.delete(app)
                    deleted_apps_count += 1
                
                # Commit the entire transaction
                db.commit()
                db.refresh(enrolled_student)
                
                logger.info(f"Student {current_application.student_email} accepted by {user.name}. Deleted {deleted_apps_count} applications from: {', '.join(deleted_institutions)}")
                
                return {
                    "message": f"Application accepted and student enrolled successfully. {deleted_apps_count} applications deleted (including this one).",
                    "enrolled_student": {
                        "id": str(enrolled_student.id),
                        "student_id": enrolled_student.student_id,
                        "student_name": enrolled_student.student_name,
                        "student_email": enrolled_student.student_email,
                        "grade": enrolled_student.grade,
                        "status": enrolled_student.status,
                        "enrolled_at": enrolled_student.enrolled_at.isoformat()
                    },
                    "deleted_applications": {
                        "count": deleted_apps_count,
                        "institutions": deleted_institutions
                    }
                }
                
            except IntegrityError as e:
                # Handle the case where unique constraint is violated (race condition)
                db.rollback()
                logger.warning(f"Race condition detected: Student {application.student_email} was already enrolled by another institution simultaneously")
                
                # Find out which institution enrolled the student
                existing_enrollment = db.query(EnrolledStudent).filter(
                    EnrolledStudent.student_email == application.student_email
                ).first()
                
                if existing_enrollment:
                    enrolled_institution = db.query(User).filter(User.id == existing_enrollment.institution_id).first()
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Student was simultaneously accepted by {enrolled_institution.name if enrolled_institution else 'another institution'}. Cannot process this application.",
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Student enrollment conflict detected. The student may have been enrolled simultaneously by another institution.",
                    )
            
            except Exception as e:
                db.rollback()
                logger.error(f"Error during application acceptance: {str(e)}")
                raise
        else:
            # For other status updates (like back to pending)
            application.status = status_update.status
            if status_update.review_notes:
                application.review_notes = status_update.review_notes
            
            db.commit()
            db.refresh(application)
            return application
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating application status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating application status: {str(e)}",
        )

# Submit an application
@app.post("/api/public/forms/{institution_id}/{form_id}/submit")
def submit_application(
    institution_id: uuid.UUID,
    form_id: uuid.UUID,
    submission_data: ApplicationSubmissionData,
    db: Session = Depends(get_db)
):
    """Submit a student application - public endpoint"""
    try:
        # Verify form exists and is active
        form = db.query(InstitutionForm).filter(
            InstitutionForm.id == form_id,
            InstitutionForm.institution_id == institution_id,
            InstitutionForm.is_active == True
        ).first()
        
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found or inactive",
            )
        
        # Extract student info from submission data
        values = submission_data.values
        
        # Extract email from various possible field names
        student_email = (
            values.get('email') or 
            values.get('emailAddress') or 
            values.get('email_address') or 
            values.get('Email Address') or 
            ''
        )
        
        if not student_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student email is required",
            )
        
        student_email = student_email.lower().strip()
        
        # CHECK IF STUDENT IS ALREADY ENROLLED SOMEWHERE (ONE-STUDENT-ONE-INSTITUTION POLICY)
        existing_enrollment = db.query(EnrolledStudent).filter(
            EnrolledStudent.student_email == student_email
        ).first()
        
        if existing_enrollment:
            enrolled_institution = db.query(User).filter(User.id == existing_enrollment.institution_id).first()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You are already enrolled in {enrolled_institution.name if enrolled_institution else 'another institution'}. Students can only be enrolled in one institution at a time.",
            )
        
        # Check if student has already applied to this specific institution
        existing_application = db.query(StudentApplication).filter(
            StudentApplication.institution_id == institution_id,
            StudentApplication.student_email == student_email
        ).first()
        
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already submitted an application to this institution",
            )
        
        # Extract name from various possible field combinations
        def extract_student_name():
            # Try different common name field combinations
            first_name = (
                values.get('firstName') or 
                values.get('first_name') or 
                values.get('First Name') or 
                values.get('fname') or 
                ''
            )
            last_name = (
                values.get('lastName') or 
                values.get('last_name') or 
                values.get('Last Name') or 
                values.get('lname') or 
                ''
            )
            full_name = (
                values.get('fullName') or 
                values.get('full_name') or 
                values.get('Full Name') or 
                values.get('name') or 
                ''
            )
            
            # If we have a full name field, use it
            if full_name.strip():
                return full_name.strip()
            
            # If we have first and/or last name, combine them
            combined = f"{first_name} {last_name}".strip()
            if combined:
                return combined
            
            # Try to find any field that might contain a name
            for key, value in values.items():
                if (isinstance(value, str) and 
                    'name' in key.lower() and 
                    value.strip() and 
                    value.strip() != 'undefined'):
                    return value.strip()
            
            # Last resort: use email prefix if available
            if student_email and '@' in student_email:
                return student_email.split('@')[0]
            
            return None
        
        student_name = extract_student_name()
        
        # Create the application
        import json
        application = StudentApplication(
            institution_id=institution_id,
            form_id=form_id,
            student_email=student_email,
            student_name=student_name if student_name else None,
            submitted_data=json.dumps(values),
            status="pending"
        )
        
        db.add(application)
        db.commit()
        db.refresh(application)
        
        return application
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error submitting application: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting application: {str(e)}",
        )

# Submit an application with authentication
@app.post("/api/forms/{institution_id}/{form_id}/submit")
def submit_authenticated_application(
    institution_id: uuid.UUID,
    form_id: uuid.UUID,
    submission_data: ApplicationSubmissionData,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Submit a student application - authenticated endpoint"""
    try:
        # Verify form exists and is active
        form = db.query(InstitutionForm).filter(
            InstitutionForm.id == form_id,
            InstitutionForm.institution_id == institution_id,
            InstitutionForm.is_active == True
        ).first()
        
        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found or inactive",
            )
        
        # Use authenticated user's info
        student_email = user.email.lower().strip()
        student_name = user.name
        
        # CHECK IF STUDENT IS ALREADY ENROLLED SOMEWHERE (ONE-STUDENT-ONE-INSTITUTION POLICY)
        existing_enrollment = db.query(EnrolledStudent).filter(
            EnrolledStudent.student_email == student_email
        ).first()
        
        if existing_enrollment:
            enrolled_institution = db.query(User).filter(User.id == existing_enrollment.institution_id).first()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You are already enrolled in {enrolled_institution.name if enrolled_institution else 'another institution'}. Students can only be enrolled in one institution at a time.",
            )
        
        # Check if user has already applied to this institution
        existing_application = db.query(StudentApplication).filter(
            StudentApplication.institution_id == institution_id,
            StudentApplication.student_email == student_email
        ).first()
        
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already submitted an application to this institution",
            )
        
        # Extract additional info from submission data
        values = submission_data.values
        
        # Create the application
        import json
        application = StudentApplication(
            institution_id=institution_id,
            form_id=form_id,
            student_email=student_email,
            student_name=student_name,
            submitted_data=json.dumps(values),
            status="pending"
        )
        
        db.add(application)
        db.commit()
        db.refresh(application)
        
        return application
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error submitting authenticated application: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting authenticated application: {str(e)}",
        )

# Get all enrolled students for an institution
@app.get("/api/institutions/{institution_id}/enrolled-students", response_model=List[EnrolledStudentRead], tags=["enrolled-students"])
def get_enrolled_students(
    institution_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Get all enrolled students for an institution - institution users only"""
    if user.role != UserRole.INSTITUTION or user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can view their enrolled students",
        )
    
    try:
        enrolled_students = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution_id
        ).order_by(EnrolledStudent.enrolled_at.desc()).all()
        
        return enrolled_students
    except Exception as e:
        logger.error(f"Error fetching enrolled students: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching enrolled students: {str(e)}",
        )

# Update enrolled student information
@app.put("/api/institutions/{institution_id}/enrolled-students/{student_id}", response_model=EnrolledStudentRead, tags=["enrolled-students"])
def update_enrolled_student(
    institution_id: uuid.UUID,
    student_id: str,
    student_update: EnrolledStudentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Update enrolled student information - institution users only"""
    if user.role != UserRole.INSTITUTION or user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can update their enrolled students",
        )
    
    try:
        enrolled_student = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution_id,
            EnrolledStudent.student_id == student_id
        ).first()
        
        if not enrolled_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrolled student not found",
            )
        
        # Update fields if provided
        if student_update.student_name is not None:
            enrolled_student.student_name = student_update.student_name
        if student_update.student_email is not None:
            enrolled_student.student_email = student_update.student_email
        if student_update.grade is not None:
            enrolled_student.grade = student_update.grade
        if student_update.status is not None:
            enrolled_student.status = student_update.status
        
        enrolled_student.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(enrolled_student)
        
        return enrolled_student
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating enrolled student: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating enrolled student: {str(e)}",
        )

# Delete enrolled student
@app.delete("/api/institutions/{institution_id}/enrolled-students/{student_id}", tags=["enrolled-students"])
def delete_enrolled_student(
    institution_id: uuid.UUID,
    student_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user)
):
    """Delete enrolled student - institution users only"""
    if user.role != UserRole.INSTITUTION or user.id != institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only institution users can delete their enrolled students",
        )
    
    try:
        enrolled_student = db.query(EnrolledStudent).filter(
            EnrolledStudent.institution_id == institution_id,
            EnrolledStudent.student_id == student_id
        ).first()
        
        if not enrolled_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrolled student not found",
            )
        
        db.delete(enrolled_student)
        db.commit()
        
        return {"message": f"Student {student_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting enrolled student: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting enrolled student: {str(e)}",
        )

# Get all students for admin - with institution info
@app.get("/api/admin/students", tags=["admin"])
def get_all_students(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get all students across all institutions - admin only"""
    try:
        # Get all users with STUDENT role
        students = db.query(User).filter(User.role == UserRole.STUDENT).all()
        
        result = []
        for student in students:
            # Get institution name if student is enrolled in one
            institution_name = None
            if student.institution_id:
                institution = db.query(User).filter(
                    User.id == student.institution_id,
                    User.role == UserRole.INSTITUTION
                ).first()
                if institution:
                    institution_name = institution.name
            
            # Also check if student is enrolled in any institution through EnrolledStudent table
            if not institution_name:
                enrolled_student = db.query(EnrolledStudent).filter(
                    EnrolledStudent.student_email == student.email
                ).first()
                if enrolled_student:
                    institution = db.query(User).filter(
                        User.id == enrolled_student.institution_id,
                        User.role == UserRole.INSTITUTION
                    ).first()
                    if institution:
                        institution_name = institution.name
            
            student_data = {
                "id": str(student.id),
                "name": student.name,
                "email": student.email,
                "institution": institution_name,  # Will be None if not enrolled
                "role": student.role,
                "is_active": student.is_active,
                "created_at": student.created_at.isoformat() if student.created_at else None,
                "bio": student.bio,
                "phone": student.phone
            }
            result.append(student_data)
        
        return {
            "students": result,
            "total_count": len(result)
        }
    except Exception as e:
        logger.error(f"Error fetching students: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching students: {str(e)}",
        )

# Delete a student - admin only
@app.delete("/api/admin/students/{student_id}", tags=["admin"])
def delete_student(
    student_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Delete a student - admin only"""
    try:
        student = db.query(User).filter(
            User.id == student_id,
            User.role == UserRole.STUDENT
        ).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        
        # Also remove from enrolled students if exists
        enrolled_students = db.query(EnrolledStudent).filter(
            EnrolledStudent.student_email == student.email
        ).all()
        
        for enrolled_student in enrolled_students:
            db.delete(enrolled_student)
        
        # Delete the user
        db.delete(student)
        db.commit()
        
        return {"message": f"Student {student.name} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting student: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting student: {str(e)}",
        ) 

# Update instructor registration with wizard data
@app.put("/api/instructor-registration/{registration_id}/wizard", tags=["instructor-registration"])
def update_instructor_registration_wizard(
    registration_id: uuid.UUID,
    wizard_data: Dict,
    db: Session = Depends(get_db)
):
    """Update instructor registration with wizard data"""
    try:
        instructor_registration = db.query(InstructorRegistration).filter(
            InstructorRegistration.id == registration_id
        ).first()
        
        if not instructor_registration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor registration not found",
            )
        
        if instructor_registration.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update registration that has been reviewed",
            )
        
        # Update wizard fields
        if wizard_data.get('bio'):
            instructor_registration.bio = wizard_data['bio']
        if wizard_data.get('phone'):
            instructor_registration.phone = wizard_data['phone']
        if wizard_data.get('specialization'):
            instructor_registration.specialization = wizard_data['specialization']
        if wizard_data.get('education'):
            instructor_registration.education = wizard_data['education']
        if wizard_data.get('experience'):
            instructor_registration.experience = wizard_data['experience']
        if wizard_data.get('certifications'):
            instructor_registration.certifications = wizard_data['certifications']
        if wizard_data.get('linkedin_profile'):
            instructor_registration.linkedin_profile = wizard_data['linkedin_profile']
        if wizard_data.get('portfolio_url'):
            instructor_registration.portfolio_url = wizard_data['portfolio_url']
        
        instructor_registration.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(instructor_registration)
        
        return {
            "message": "Instructor registration updated successfully",
            "registration": InstructorRegistrationRead.from_orm(instructor_registration)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating instructor registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating instructor registration: {str(e)}",
        )

# Get all instructor registrations for admin (Tutor Registrations page)
@app.get("/api/admin/instructor-registrations", response_model=List[InstructorRegistrationRead], tags=["admin"])
def get_instructor_registrations(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user),
    status: Optional[str] = None
):
    """Get all instructor registrations - admin only"""
    try:
        query = db.query(InstructorRegistration)
        
        if status:
            query = query.filter(InstructorRegistration.status == status)
        
        registrations = query.order_by(InstructorRegistration.submitted_at.desc()).all()
        
        return registrations
    except Exception as e:
        logger.error(f"Error fetching instructor registrations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching instructor registrations: {str(e)}",
        )

# Get specific instructor registration details
@app.get("/api/admin/instructor-registrations/{registration_id}", response_model=InstructorRegistrationRead, tags=["admin"])
def get_instructor_registration(
    registration_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get specific instructor registration details - admin only"""
    try:
        registration = db.query(InstructorRegistration).filter(
            InstructorRegistration.id == registration_id
        ).first()
        
        if not registration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor registration not found",
            )
        
        return registration
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching instructor registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching instructor registration: {str(e)}",
        )

# Approve or reject instructor registration
@app.put("/api/admin/instructor-registrations/{registration_id}/status", tags=["admin"])
def update_instructor_registration_status(
    registration_id: uuid.UUID,
    status_update: InstructorRegistrationUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Approve or reject instructor registration - admin only"""
    try:
        registration = db.query(InstructorRegistration).filter(
            InstructorRegistration.id == registration_id
        ).first()
        
        if not registration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor registration not found",
            )
        
        if registration.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration has already been reviewed",
            )
        
        if status_update.status == "approved":
            # Create the actual User account
            # Check if user already exists (safety check)
            existing_user = db.query(User).filter(User.email == registration.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User account already exists with this email",
                )
            
            # Create new instructor user
            instructor_user = User(
                id=uuid.uuid4(),
                name=registration.name,
                email=registration.email,
                hashed_password=registration.password_hash,  # Use stored hash
                role=UserRole.INSTRUCTOR,
                is_active=True,
                is_verified=True,
                bio=registration.bio,
                phone=registration.phone,
                specialization=registration.specialization
            )
            
            db.add(instructor_user)
            
            # Update registration status
            registration.status = "approved"
            registration.reviewed_at = datetime.utcnow()
            registration.reviewed_by = admin_user.id
            registration.review_notes = status_update.review_notes
            
            db.commit()
            db.refresh(instructor_user)
            db.refresh(registration)
            
            return {
                "message": "Instructor registration approved and user account created",
                "instructor_id": str(instructor_user.id),
                "registration": InstructorRegistrationRead.from_orm(registration)
            }
        
        elif status_update.status == "rejected":
            # Just update the status, don't delete the record
            registration.status = "rejected"
            registration.reviewed_at = datetime.utcnow()
            registration.reviewed_by = admin_user.id
            registration.review_notes = status_update.review_notes
            
            db.commit()
            db.refresh(registration)
            
            return {
                "message": "Instructor registration rejected",
                "registration": InstructorRegistrationRead.from_orm(registration)
            }
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'approved' or 'rejected'",
            )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating instructor registration status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating instructor registration status: {str(e)}",
        )

# Get all approved instructors (View Tutors page)
@app.get("/api/admin/instructors", response_model=List[ApprovedInstructorRead], tags=["admin"])
def get_approved_instructors(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get all approved instructors with subscription status - admin only (View Tutors page)"""
    try:
        instructors = db.query(User).filter(
            User.role == UserRole.INSTRUCTOR,
            User.is_active == True
        ).order_by(User.created_at.desc()).all()
        
        # Get all instructor IDs to fetch subscription statuses in bulk
        instructor_ids = [instructor.id for instructor in instructors]
        
        # Get all active subscriptions for these instructors
        subscriptions = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id.in_(instructor_ids),
            RedMarkSubscription.is_active == True
        ).all()
        
        # Create a map of instructor_id -> subscription
        subscription_map = {sub.instructor_id: sub for sub in subscriptions}
        
        now = datetime.utcnow()
        result = []
        
        for instructor in instructors:
            subscription = subscription_map.get(instructor.id)
            
            # Check subscription status
            has_red_mark = False
            expires_soon = False
            end_date = None
            
            if subscription:
                # Check if subscription is still valid
                is_expired = subscription.end_date and now > subscription.end_date
                
                if not is_expired:
                    has_red_mark = True
                    end_date = subscription.end_date
                    
                    # Check if expires soon (within 7 days)
                    if subscription.end_date:
                        days_until_expiry = (subscription.end_date - now).days
                        expires_soon = days_until_expiry <= 7 and days_until_expiry > 0
                else:
                    # Auto-deactivate expired subscription
                    subscription.is_active = False
            
            instructor_data = ApprovedInstructorRead(
                id=instructor.id,
                name=instructor.name,
                email=instructor.email,
                specialization=instructor.specialization,
                bio=instructor.bio,
                phone=instructor.phone,
                status="Dashboarder Certified",
                is_active=instructor.is_active,
                created_at=instructor.created_at,
                has_red_mark=has_red_mark,
                subscription_expires_soon=expires_soon,
                subscription_end_date=end_date
            )
            result.append(instructor_data)
        
        # Commit any subscription status updates
        db.commit()
        
        return result
    except Exception as e:
        logger.error(f"Error fetching approved instructors: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching approved instructors: {str(e)}",
        )

# Delete an approved instructor
@app.delete("/api/admin/instructors/{instructor_id}", tags=["admin"])
def delete_instructor(
    instructor_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Delete an approved instructor - admin only"""
    try:
        instructor = db.query(User).filter(
            User.id == instructor_id,
            User.role == UserRole.INSTRUCTOR
        ).first()
        
        if not instructor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor not found",
            )
        
        # Delete any related Red Mark subscriptions first to avoid foreign key constraint violations
        red_mark_subscriptions = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id == instructor_id
        ).all()
        
        for subscription in red_mark_subscriptions:
            db.delete(subscription)
        
        # Delete any related instructor profiles
        instructor_profiles = db.query(InstructorProfile).filter(
            InstructorProfile.instructor_id == instructor_id
        ).all()
        
        for profile in instructor_profiles:
            db.delete(profile)
        
        # Now delete the instructor
        db.delete(instructor)
        db.commit()
        
        logger.info(f"Instructor {instructor.name} and {len(red_mark_subscriptions)} related subscriptions deleted successfully")
        
        return {"message": f"Instructor {instructor.name} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting instructor: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting instructor: {str(e)}",
        )

# Get current instructor profile
@app.get("/api/instructors/me/profile", tags=["instructors"])
def get_instructor_profile(
    db: Session = Depends(get_db),
    instructor: User = Depends(current_instructor_user)
):
    """Get current instructor's complete profile data with payment-based restrictions"""
    try:
        import json
        
        # Get or create instructor profile
        instructor_profile = db.query(InstructorProfile).filter(
            InstructorProfile.instructor_id == instructor.id
        ).first()
        
        # Basic instructor data (always available)
        instructor_data = {
            "id": str(instructor.id),
            "name": instructor.name,
            "email": instructor.email,
            "bio": instructor.bio,
            "phone": instructor.phone,
            "specialization": instructor.specialization,
            "created_at": instructor.created_at.isoformat() if instructor.created_at else None,
            "is_active": instructor.is_active
        }
        
        # Payment-based profile features
        profile_data = {
            "teacherCode": f"IS{str(instructor.id)[:6].upper()}",
            "title": instructor.specialization or "Subject Matter Expert",
            "avatar": instructor.profile_picture or "https://bit.ly/dan-abramov",  # Use profile_picture or default
            "red_mark": instructor.red_mark,  # NULL if not purchased
            "level": instructor.level,  # NULL if not purchased
        }
        
        # Editable fields from InstructorProfile (always available for editing)
        if instructor_profile:
            # Parse JSON strings back to arrays/objects
            skills = json.loads(instructor_profile.skills) if instructor_profile.skills else []
            education = json.loads(instructor_profile.education) if instructor_profile.education else []
            certifications = json.loads(instructor_profile.certifications) if instructor_profile.certifications else []
            languages = json.loads(instructor_profile.languages) if instructor_profile.languages else ["English"]
            
            profile_data.update({
                "location": instructor_profile.location,  # Can be NULL
                "custom_bio": instructor_profile.custom_bio,
                "skills": skills,
                "education": education,
                "certifications": certifications,
                "languages": languages
            })
        else:
            # Default empty values
            profile_data.update({
                "location": None,
                "custom_bio": None,
                "skills": [],
                "education": [],
                "certifications": [],
                "languages": ["English"]
            })
        
        # Non-payment features (empty until instructor gets assigned/reviewed)
        courses = []  # Empty array - not payment-based, just no courses assigned yet
        reviews = []  # Empty array - not payment-based, just no reviews yet
        total_students = 0  # 0 students - not payment-based
        
        # Calculate rating from reviews (when they exist)
        average_rating = 0.0
        total_reviews = 0
        
        # Basic free features
        profile_data.update({
            "responseTime": "1 hour",  # Free feature
            "rating": average_rating,
            "totalReviews": total_reviews,
        })
        
        return {
            "instructor": instructor_data,
            "profile": profile_data,
            "courses": courses,  # Empty array for non-paying instructors
            "reviews": reviews,  # Empty array for non-paying instructors
            "statistics": {
                "total_courses": len(courses),  # 0 for non-paying instructors
                "total_students": total_students,  # 0 for non-paying instructors
                "certifications_count": len(profile_data.get("certifications", []))  # Available for editing
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching instructor profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching instructor profile: {str(e)}",
        )

# Update instructor profile
@app.put("/api/instructors/me/profile", tags=["instructors"])
def update_instructor_profile(
    profile_data: Dict,
    db: Session = Depends(get_db),
    instructor: User = Depends(current_instructor_user)
):
    """Update current instructor's profile - editable fields stored in InstructorProfile table"""
    try:
        import json
        
        # Get or create instructor profile
        instructor_profile = db.query(InstructorProfile).filter(
            InstructorProfile.instructor_id == instructor.id
        ).first()
        
        if not instructor_profile:
            instructor_profile = InstructorProfile(instructor_id=instructor.id)
            db.add(instructor_profile)
        
        # Update basic user fields (always editable)
        current_instructor = db.query(User).filter(User.id == instructor.id).first()
        if profile_data.get('bio') is not None:
            current_instructor.bio = profile_data['bio']
        if profile_data.get('phone') is not None:
            current_instructor.phone = profile_data['phone']
        if profile_data.get('specialization') is not None:
            current_instructor.specialization = profile_data['specialization']
        if profile_data.get('name') is not None:
            current_instructor.name = profile_data['name']
        if profile_data.get('avatar') is not None:
            current_instructor.profile_picture = profile_data['avatar']
        
        # Update InstructorProfile fields (editable regardless of payment)
        if profile_data.get('custom_bio') is not None:
            instructor_profile.custom_bio = profile_data['custom_bio']
        if profile_data.get('location') is not None:
            instructor_profile.location = profile_data['location']
        if profile_data.get('skills') is not None:
            instructor_profile.skills = json.dumps(profile_data['skills'])
        if profile_data.get('education') is not None:
            instructor_profile.education = json.dumps(profile_data['education'])
        if profile_data.get('certifications') is not None:
            instructor_profile.certifications = json.dumps(profile_data['certifications'])
        if profile_data.get('languages') is not None:
            instructor_profile.languages = json.dumps(profile_data['languages'])
        
        current_instructor.updated_at = datetime.utcnow()
        instructor_profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(current_instructor)
        db.refresh(instructor_profile)
        
        return {
            "message": "Profile updated successfully",
            "instructor": {
                "id": str(current_instructor.id),
                "name": current_instructor.name,
                "email": current_instructor.email,
                "bio": current_instructor.bio,
                "phone": current_instructor.phone,
                "specialization": current_instructor.specialization,
                "updated_at": current_instructor.updated_at.isoformat() if current_instructor.updated_at else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating instructor profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating instructor profile: {str(e)}",
        )

# Red Mark Subscription endpoints

# Get instructor's Red Mark subscription status
@app.get("/api/instructors/{instructor_id}/subscription/red-mark", response_model=SubscriptionStatusResponse, tags=["subscriptions"])
def get_red_mark_subscription_status(
    instructor_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get Red Mark subscription status for any instructor - public endpoint for displaying badges"""
    try:
        # Get instructor
        instructor = db.query(User).filter(
            User.id == instructor_id,
            User.role == UserRole.INSTRUCTOR
        ).first()
        
        if not instructor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor not found"
            )
        
        # Get subscription
        subscription = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id == instructor_id
        ).first()
        
        if not subscription or not subscription.is_active:
            return SubscriptionStatusResponse(
                has_red_mark=False,
                is_active=False
            )
        
        # Check if subscription is still valid
        now = datetime.utcnow()
        is_expired = subscription.end_date and now > subscription.end_date
        
        if is_expired:
            # Auto-deactivate expired subscription
            subscription.is_active = False
            db.commit()
            
            return SubscriptionStatusResponse(
                has_red_mark=False,
                is_active=False
            )
        
        # Calculate expiry info
        expires_soon = False
        days_until_expiry = None
        
        if subscription.end_date:
            days_until_expiry = (subscription.end_date - now).days
            expires_soon = days_until_expiry <= 7 and days_until_expiry > 0
        
        return SubscriptionStatusResponse(
            has_red_mark=True,
            is_active=True,
            subscription_type=subscription.subscription_type,
            end_date=subscription.end_date,
            expires_soon=expires_soon,
            days_until_expiry=days_until_expiry
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting subscription status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting subscription status: {str(e)}"
        )

# Get current instructor's subscription status
@app.get("/api/instructors/me/subscription/red-mark", response_model=SubscriptionStatusResponse, tags=["subscriptions"])
def get_my_red_mark_subscription_status(
    db: Session = Depends(get_db),
    instructor: User = Depends(current_instructor_user)
):
    """Get current instructor's Red Mark subscription status"""
    return get_red_mark_subscription_status(instructor.id, db)

# Purchase/Activate Red Mark subscription
@app.post("/api/instructors/me/subscription/red-mark", response_model=RedMarkSubscriptionRead, tags=["subscriptions"])
def purchase_red_mark_subscription(
    subscription_data: RedMarkSubscriptionCreate,
    db: Session = Depends(get_db),
    instructor: User = Depends(current_instructor_user)
):
    """Purchase and activate Red Mark subscription for current instructor"""
    try:
        # Check if instructor already has an active subscription
        existing_subscription = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id == instructor.id
        ).first()
        
        if existing_subscription and existing_subscription.is_active:
            # Check if still valid
            now = datetime.utcnow()
            if existing_subscription.end_date and now < existing_subscription.end_date:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Instructor already has an active Red Mark subscription"
                )
        
        # Calculate subscription dates
        now = datetime.utcnow()
        if subscription_data.subscription_type == "annual":
            end_date = now + timedelta(days=365)
            next_billing_date = end_date
        else:  # monthly
            end_date = now + timedelta(days=30)
            next_billing_date = end_date
        
        # Create or update subscription
        if existing_subscription:
            # Update existing subscription
            existing_subscription.is_active = True
            existing_subscription.subscription_type = subscription_data.subscription_type
            existing_subscription.price_paid = subscription_data.price_paid
            existing_subscription.currency = subscription_data.currency
            existing_subscription.start_date = now
            existing_subscription.end_date = end_date
            existing_subscription.next_billing_date = next_billing_date
            existing_subscription.auto_renew = subscription_data.auto_renew
            existing_subscription.payment_method = subscription_data.payment_method
            existing_subscription.payment_reference = subscription_data.payment_reference
            existing_subscription.cancelled_at = None
            existing_subscription.updated_at = now
            
            subscription = existing_subscription
        else:
            # Create new subscription
            subscription = RedMarkSubscription(
                instructor_id=instructor.id,
                is_active=True,
                subscription_type=subscription_data.subscription_type,
                price_paid=subscription_data.price_paid,
                currency=subscription_data.currency,
                start_date=now,
                end_date=end_date,
                next_billing_date=next_billing_date,
                auto_renew=subscription_data.auto_renew,
                payment_method=subscription_data.payment_method,
                payment_reference=subscription_data.payment_reference
            )
            db.add(subscription)
        
        # Update instructor's red_mark status in User table
        instructor.red_mark = True
        
        db.commit()
        db.refresh(subscription)
        
        logger.info(f"Red Mark subscription activated for instructor {instructor.id}")
        
        return subscription
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error purchasing Red Mark subscription: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error purchasing Red Mark subscription: {str(e)}"
        )

# Cancel Red Mark subscription
@app.delete("/api/instructors/me/subscription/red-mark", tags=["subscriptions"])
def cancel_red_mark_subscription(
    db: Session = Depends(get_db),
    instructor: User = Depends(current_instructor_user)
):
    """Cancel current instructor's Red Mark subscription"""
    try:
        subscription = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id == instructor.id
        ).first()
        
        if not subscription or not subscription.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active Red Mark subscription found"
            )
        
        # Cancel subscription
        subscription.is_active = False
        subscription.auto_renew = False
        subscription.cancelled_at = datetime.utcnow()
        
        # Update instructor's red_mark status
        instructor.red_mark = False
        
        db.commit()
        
        logger.info(f"Red Mark subscription cancelled for instructor {instructor.id}")
        
        return {"message": "Red Mark subscription cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error cancelling Red Mark subscription: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error cancelling Red Mark subscription: {str(e)}"
        )

# Bulk subscription status check (for admin panel, lists, etc.)
@app.post("/api/subscriptions/bulk-check", tags=["subscriptions"])
def bulk_check_subscription_status(
    instructor_ids: List[uuid.UUID],
    db: Session = Depends(get_db)
):
    """Check Red Mark subscription status for multiple instructors at once"""
    try:
        statuses = {}
        
        # Get all subscriptions for the provided instructor IDs
        subscriptions = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id.in_(instructor_ids),
            RedMarkSubscription.is_active == True
        ).all()
        
        # Create a map of instructor_id -> subscription
        subscription_map = {sub.instructor_id: sub for sub in subscriptions}
        
        now = datetime.utcnow()
        
        for instructor_id in instructor_ids:
            subscription = subscription_map.get(instructor_id)
            
            if not subscription:
                statuses[str(instructor_id)] = SubscriptionStatusResponse(
                    has_red_mark=False,
                    is_active=False
                )
                continue
            
            # Check if expired
            is_expired = subscription.end_date and now > subscription.end_date
            
            if is_expired:
                statuses[str(instructor_id)] = SubscriptionStatusResponse(
                    has_red_mark=False,
                    is_active=False
                )
                continue
            
            # Calculate expiry info
            expires_soon = False
            days_until_expiry = None
            
            if subscription.end_date:
                days_until_expiry = (subscription.end_date - now).days
                expires_soon = days_until_expiry <= 7 and days_until_expiry > 0
            
            statuses[str(instructor_id)] = SubscriptionStatusResponse(
                has_red_mark=True,
                is_active=True,
                subscription_type=subscription.subscription_type,
                end_date=subscription.end_date,
                expires_soon=expires_soon,
                days_until_expiry=days_until_expiry
            )
        
        return statuses
        
    except Exception as e:
        logger.error(f"Error in bulk subscription check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in bulk subscription check: {str(e)}"
        )

# Test endpoint to set up Lucc Graham with Red Mark subscription
@app.post("/api/test/setup-lucc-graham", tags=["test"])
def setup_lucc_graham_subscription(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Test endpoint to set up Lucc Graham with Red Mark subscription expiring in 7 minutes"""
    try:
        # Find or create Lucc Graham instructor
        lucc_graham = db.query(User).filter(
            User.email == "lucc.graham@example.com"
        ).first()
        
        if not lucc_graham:
            # Create Lucc Graham instructor
            lucc_graham = User(
                email="lucc.graham@example.com",
                name="Lucc Graham",
                role=UserRole.INSTRUCTOR,
                bio="Expert instructor with advanced teaching credentials",
                specialization="Mathematics and Computer Science",
                phone="+1-555-0123",
                is_active=True,
                is_verified=True,
                red_mark=True
            )
            lucc_graham.set_password("password123")  # Set a default password
            db.add(lucc_graham)
            db.flush()  # Get the ID
        
        # Find existing subscription
        existing_subscription = db.query(RedMarkSubscription).filter(
            RedMarkSubscription.instructor_id == lucc_graham.id
        ).first()
        
        # Create new subscription expiring in 7 minutes
        now = datetime.utcnow()
        expiry_date = now + timedelta(minutes=7)
        
        if existing_subscription:
            # Update existing subscription
            existing_subscription.is_active = True
            existing_subscription.subscription_type = "monthly"
            existing_subscription.price_paid = 10.00
            existing_subscription.currency = "USD"
            existing_subscription.start_date = now - timedelta(days=23)  # Started 23 days ago
            existing_subscription.end_date = expiry_date  # Expires in 7 minutes
            existing_subscription.next_billing_date = expiry_date
            existing_subscription.auto_renew = True
            existing_subscription.payment_method = "credit_card"
            existing_subscription.payment_reference = "test_payment_lucc_graham"
            existing_subscription.cancelled_at = None
            subscription = existing_subscription
        else:
            # Create new subscription
            subscription = RedMarkSubscription(
                instructor_id=lucc_graham.id,
                is_active=True,
                subscription_type="monthly",
                price_paid=10.00,
                currency="USD",
                start_date=now - timedelta(days=23),  # Started 23 days ago
                end_date=expiry_date,  # Expires in 7 minutes
                next_billing_date=expiry_date,
                auto_renew=True,
                payment_method="credit_card",
                payment_reference="test_payment_lucc_graham"
            )
            db.add(subscription)
        
        # Update instructor's red_mark status
        lucc_graham.red_mark = True
        
        db.commit()
        db.refresh(lucc_graham)
        db.refresh(subscription)
        
        return {
            "message": "Lucc Graham set up successfully with Red Mark subscription",
            "instructor": {
                "id": str(lucc_graham.id),
                "name": lucc_graham.name,
                "email": lucc_graham.email,
                "red_mark": lucc_graham.red_mark
            },
            "subscription": {
                "id": str(subscription.id),
                "is_active": subscription.is_active,
                "subscription_type": subscription.subscription_type,
                "end_date": subscription.end_date.isoformat(),
                "expires_in_minutes": 7
            }
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error setting up Lucc Graham: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting up Lucc Graham: {str(e)}"
        )

# Admin endpoint to get Red Mark subscribers for management table
@app.get("/api/admin/red-mark-subscribers", tags=["admin"])
def get_red_mark_subscribers(
    db: Session = Depends(get_db),
    admin_user: User = Depends(current_admin_user)
):
    """Get all instructors with Red Mark subscriptions for admin management table"""
    try:
        # Get all active Red Mark subscriptions with instructor info
        query = db.query(
            RedMarkSubscription,
            User
        ).join(
            User, RedMarkSubscription.instructor_id == User.id
        ).filter(
            RedMarkSubscription.is_active == True,
            User.role == UserRole.INSTRUCTOR
        ).order_by(RedMarkSubscription.start_date.desc())
        
        subscriptions_with_users = query.all()
        
        now = datetime.utcnow()
        subscribers = []
        
        for subscription, instructor in subscriptions_with_users:
            # Check if expired
            is_expired = subscription.end_date and now > subscription.end_date
            
            if is_expired:
                # Auto-deactivate expired subscription
                subscription.is_active = False
                instructor.red_mark = False
                continue
            
            # Calculate remaining time
            remaining_time = None
            remaining_time_str = "Never expires"
            is_verified = True
            
            if subscription.end_date:
                time_diff = subscription.end_date - now
                days = time_diff.days
                hours, remainder = divmod(time_diff.seconds, 3600)
                minutes, _ = divmod(remainder, 60)
                
                if days > 0:
                    remaining_time_str = f"{days} day{'s' if days != 1 else ''}"
                elif hours > 0:
                    remaining_time_str = f"{hours} hour{'s' if hours != 1 else ''}"
                else:
                    remaining_time_str = f"{minutes} minute{'s' if minutes != 1 else ''}"
                
                # Mark as expiring soon if less than 7 days
                if days < 7:
                    remaining_time_str += " (Expires Soon)"
            
            subscribers.append({
                "id": str(instructor.id),
                "name": instructor.name,
                "email": instructor.email,
                "status": "Verified" if is_verified else "Not Verified",
                "is_verified": is_verified,
                "remaining_time": remaining_time_str,
                "subscribed_at": subscription.start_date.isoformat() if subscription.start_date else None,
                "subscription_type": subscription.subscription_type,
                "price_paid": subscription.price_paid,
                "currency": subscription.currency,
                "last_transaction_id": subscription.payment_reference,
                "auto_renew": subscription.auto_renew,
                "end_date": subscription.end_date.isoformat() if subscription.end_date else None,
                "expires_soon": subscription.end_date and (subscription.end_date - now).days < 7 if subscription.end_date else False
            })
        
        # Commit any auto-deactivations
        db.commit()
        
        return {
            "subscribers": subscribers,
            "total_count": len(subscribers),
            "last_updated": now.isoformat()
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error getting Red Mark subscribers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting Red Mark subscribers: {str(e)}"
        )