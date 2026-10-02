import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const PublicOnly: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const isRecruiterOrAdmin = user?.roles?.some(
      (r) => r === 'Recruiter' || r === 'Admin' || r === 'HiringManager'
    );
    const redirectPath = isRecruiterOrAdmin ? '/recruiter/dashboard' : '/candidate/applications';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
