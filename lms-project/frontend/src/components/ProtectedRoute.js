import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Always return children for now
  return children;

  // Original logic kept for reference
  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */