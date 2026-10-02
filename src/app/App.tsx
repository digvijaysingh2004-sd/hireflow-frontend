import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { JobsPage } from '../features/jobs/pages/JobsPage';
import { JobDetailPage } from '../features/jobs/pages/JobDetailPage';
import { CandidateApplicationsPage } from '../features/applications/pages/CandidateApplicationsPage';
import { CandidateApplicationDetailPage } from '../features/applications/pages/CandidateApplicationDetailPage';
import { CandidateInterviewsPage } from '../features/interviews/pages/CandidateInterviewsPage';
import { RecruiterDashboardPage } from '../features/dashboard/pages/RecruiterDashboardPage';
import { RecruiterJobsPage } from '../features/jobs/pages/RecruiterJobsPage';
import { RecruiterApplicationsPage } from '../features/applications/pages/RecruiterApplicationsPage';
import { RecruiterInterviewsPage } from '../features/interviews/pages/RecruiterInterviewsPage';
import { UserManagementPage } from '../features/admin/pages/UserManagementPage';
import { AuditLogsPage } from '../features/dashboard/pages/AuditLogsPage';
import { PublicOnly } from '../routes/guards/PublicOnly';
import { RequireAuth } from '../routes/guards/RequireAuth';
import { RequireRole } from '../routes/guards/RequireRole';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Public Only Guest Routes */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* App Layout Protected Dashboard Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          {/* Candidate Routes */}
          <Route element={<RequireRole allowedRoles={['Candidate', 'Admin']} />}>
            <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
            <Route path="/candidate/applications/:id" element={<CandidateApplicationDetailPage />} />
            <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
          </Route>

          {/* Recruiter / Hiring Manager Routes */}
          <Route element={<RequireRole allowedRoles={['Recruiter', 'HiringManager', 'Admin']} />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/applications" element={<RecruiterApplicationsPage />} />
            <Route path="/recruiter/interviews" element={<RecruiterInterviewsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireRole allowedRoles={['Admin']} />}>
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
