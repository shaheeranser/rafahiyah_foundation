import React from 'react';
import { Navigate } from 'react-router-dom';

// Replace this with your actual authentication logic
const isAuthenticated = () => {
  // Authentication disabled for now
  return true; 
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute; 