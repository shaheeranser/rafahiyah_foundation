import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if user is authenticated and has admin role
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const userDataString = localStorage.getItem('userData');

  if (!token || !userDataString) {
    return false;
  }

  try {
    const userData = JSON.parse(userDataString);
    return userData.role === 'admin';
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute;