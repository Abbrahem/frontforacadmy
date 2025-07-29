import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-dark-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if teacher is approved
  if (user?.role === 'teacher' && !user?.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center card max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Account Pending Approval</h2>
          <p className="text-dark-300">
            Your teacher account is currently under review. Please wait for admin approval.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
