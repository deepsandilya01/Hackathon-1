import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { getDashboardPath } from '../utils/roleRedirect';

export default function Protected({ allowedRoles }) {
  const { user, isAuthenticated, isInitialized, loading } = useAuth();

  if (loading || !isInitialized) {
    return <div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = String(user.role).trim().toLowerCase();
  const normalizedAllowedRoles = allowedRoles?.map((role) => String(role).trim().toLowerCase());

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}
