# Dashboarder LMS Frontend

This repository contains the frontend code for the Dashboarder Learning Management System. The backend has been completely removed and needs to be implemented separately.

## Project Structure

- `/lms-project/frontend` - React-based frontend application

## Getting Started

To run the frontend application:

```bash
npm start
```

This will navigate to the frontend directory and start the React development server.

## Backend Requirements

The frontend expects the following API endpoints:

- Authentication: `/api/auth/login`
- Forms: `/api/public/forms/:institutionId`
- Field Templates: `/api/public/field-templates`
- Students: `/api/public/institution-data/:institutionId/students`

You'll need to implement these endpoints in your own backend solution or use a mocking service.

## Frontend Configuration

The frontend currently has hardcoded references to a local backend at `http://localhost:5001`. 
You will need to update these references to point to your new backend solution. 