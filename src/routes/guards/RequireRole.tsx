import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { UserRole } from '../../features/auth/types';

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  const hasAllowedRole = user?.roles?.some((role) => allowedRoles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
