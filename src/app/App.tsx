import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
          <Route element={<RequireRole allowedRoles={['Candidate', 'Admin']} />}>
            <Route
              path="/candidate/applications"
              element={
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">My Applications</h2>
                  <p className="text-slate-600 text-sm">Candidate application workflow & timeline history will appear in Phase 5.</p>
                </div>
              }
            />
            <Route
              path="/candidate/interviews"
              element={
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">My Scheduled Interviews</h2>
                  <p className="text-slate-600 text-sm">Candidate interview schedule view will appear in Phase 5.</p>
                </div>
              }
            />
          </Route>

          <Route element={<RequireRole allowedRoles={['Recruiter', 'HiringManager', 'Admin']} />}>
            <Route
              path="/recruiter/dashboard"
              element={
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Hiring Overview & KPIs</h2>
                  <p className="text-slate-600 text-sm">Recruiter dashboard metrics & job management table will appear in Phase 6.</p>
                </div>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Jobs Management</h2>
                  <p className="text-slate-600 text-sm">Create, edit, publish & close jobs in Phase 6.</p>
                </div>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
