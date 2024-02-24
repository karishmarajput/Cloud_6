import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../admin/AdminDashboard';
import AdminLogin from '../admin/AdminLogin';
function AuthenticatedAdminRoute({ element: Element, ...rest }) {
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken; // Check if authToken exists

  // Retrieve admin name from the token if authenticated
  const getAdminName = () => {
    if (isAuthenticated) {
      try {
        const tokenData = authToken.split('.')[1];
        const decodedToken = atob(tokenData);
        const { username } = JSON.parse(decodedToken);
        return username;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const adminName = getAdminName();

  return isAuthenticated ? (
    <AdminDashboard/>
  ) : (
    <AdminLogin />
  );
}

export default AuthenticatedAdminRoute;
