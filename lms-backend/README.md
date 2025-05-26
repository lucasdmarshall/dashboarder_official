# Dashboarder LMS Backend

This is the FastAPI backend for the Dashboarder LMS multi-tenant learning management system.

## Features

- Multi-tenant architecture
- Role-based authentication (Admin, Institution, Instructor, Student)
- JWT-based authentication
- PostgreSQL database with SQLAlchemy ORM
- Fastapi-users for user management

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- Virtual environment tool (venv, conda, etc.)

### Installation

1. Clone the repository
2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create PostgreSQL database:

```bash
createdb lms_db  # Or use pgAdmin/another tool to create the database
```

5. Set up environment variables (or use the defaults in config.py):

```bash
# Example .env file
DATABASE_URL=postgresql://username:password@localhost:5432/lms_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:3001
```

### Running the application

1. Start the API server:

```bash
python run.py
```

2. Seed the database with test users:

```bash
python seed_db.py
```

## API Documentation

Once the server is running, you can access:

- Swagger UI: http://localhost:5001/docs
- ReDoc: http://localhost:5001/redoc

## Test Users

The seed script creates the following test users:

### Admin Users
- Email: admin1@dashboarder.com | Password: Admin123!
- Email: admin2@dashboarder.com | Password: Admin456!

### Institution Users
- Email: institution1@dashboarder.com | Password: Institution123!
- Email: institution2@dashboarder.com | Password: Institution456!

### Instructor Users
- Email: instructor1@dashboarder.com | Password: Instructor123!
- Email: instructor2@dashboarder.com | Password: Instructor456!

### Student Users
- Email: student1@dashboarder.com | Password: Student123!
- Email: student2@dashboarder.com | Password: Student456! 