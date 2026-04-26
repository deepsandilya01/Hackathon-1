import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

export default function Protected({ allowedRoles }) {
  const { user, isAuthenticated, isInitialized, loading } = useAuth();

  if (loading || !isInitialized) {
    return <div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Staff' ? '/staff/dashboard' : '/user/dashboard'} replace />;
  }

  return <Outlet />;
}
