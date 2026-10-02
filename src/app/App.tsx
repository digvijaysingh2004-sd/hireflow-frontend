import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Briefcase, LogOut, User as UserIcon } from 'lucide-react';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { PublicOnly } from '../routes/guards/PublicOnly';
import { RequireAuth } from '../routes/guards/RequireAuth';
import { RequireRole } from '../routes/guards/RequireRole';
import { useAuth } from '../features/auth/hooks/useAuth';

export const App: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <header className="max-w-5xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-200 mb-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Briefcase className="w-6 h-6" />
          <span>HireFlow</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                <UserIcon className="w-3.5 h-3.5" /> {user.firstName} ({user.roles.join(', ')})
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-red-600 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-semibold">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full flex-1">
        <Routes>
          {/* Public Landing Route */}
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
                  Phase 1 & Phase 2 Active: Authentication System complete with JWT bearer tokens, automatic 401 refresh token rotation, email OTP verification, password reset, and role-based route guards.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Session Status</h3>
                    <p className="text-xs text-slate-600">
                      {isAuthenticated ? `Logged in as ${user?.email}` : 'Not authenticated'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">User Roles</h3>
                    <p className="text-xs text-slate-600">
                      {user?.roles?.length ? user.roles.join(', ') : 'Guest (No Roles)'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Phase 2 Status</h3>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Integrated
                    </p>
                  </div>
                </div>
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

          {/* Authenticated Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route element={<RequireRole allowedRoles={['Candidate', 'Admin']} />}>
              <Route
                path="/candidate/applications"
                element={
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Candidate Dashboard</h2>
                    <p className="text-slate-600 text-sm">Welcome Candidate! Your applications will appear here in Phase 5.</p>
                  </div>
                }
              />
            </Route>

            <Route element={<RequireRole allowedRoles={['Recruiter', 'HiringManager', 'Admin']} />}>
              <Route
                path="/recruiter/dashboard"
                element={
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Recruiter Dashboard</h2>
                    <p className="text-slate-600 text-sm">Welcome Recruiter! Job postings and candidate management will appear here in Phase 6.</p>
                  </div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </main>

      <footer className="max-w-5xl mx-auto w-full text-center py-6 text-xs text-slate-400 border-t border-slate-200 mt-8">
        HireFlow Recruitment Microservices • Phase 2 Auth Integrated
      </footer>
    </div>
  );
};

export default App;
