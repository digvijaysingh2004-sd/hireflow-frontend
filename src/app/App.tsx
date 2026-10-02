import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { PublicOnly } from '../routes/guards/PublicOnly';
import { RequireAuth } from '../routes/guards/RequireAuth';
import { RequireRole } from '../routes/guards/RequireRole';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const App: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full mb-4">
                <ShieldCheck className="w-4 h-4" /> Enterprise Recruitment Platform
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Welcome to HireFlow
              </h1>
              <p className="text-slate-600 mb-6 max-w-2xl">
                Phase 3 Infrastructure Active: Reusable UI Component Library (Buttons, Inputs, Selects, Modals, Drawers, DataTables, Badges, Toasts) and Layout Shells (PublicLayout & AppLayout).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">Session Status</h3>
                  <p className="text-xs text-slate-600">
                    {isAuthenticated ? `Logged in as ${user?.email}` : 'Guest User'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">Roles</h3>
                  <p className="text-xs text-slate-600">
                    {user?.roles?.length ? user.roles.join(', ') : 'None'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">Phase 3 Status</h3>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Component Library Ready
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <Route
          path="/jobs"
          element={
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Search & Opportunities</h2>
              <p className="text-slate-600 text-sm">Public job listings search & filters will be populated in Phase 4.</p>
            </div>
          }
        />

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
