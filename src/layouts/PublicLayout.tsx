import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isRecruiterOrAdmin = user?.roles?.some(
    (r) => r === 'Recruiter' || r === 'Admin' || r === 'HiringManager'
  );
  const dashboardPath = isRecruiterOrAdmin ? '/recruiter/dashboard' : '/candidate/applications';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Sleek Modern Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <span>HireFlow</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/jobs') ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Find Jobs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold px-2 py-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Multi-Column Professional Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-lg text-slate-900">
                <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span>HireFlow</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Production-minded recruitment workflow platform powered by .NET 10 LTS microservices, PostgreSQL, React, and JWT security.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Candidates</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/jobs" className="hover:text-indigo-600">Browse Tech Jobs</Link></li>
                <li><Link to="/register" className="hover:text-indigo-600">Create Profile</Link></li>
                <li><Link to="/candidate/applications" className="hover:text-indigo-600">Application Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Recruiters</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/recruiter/dashboard" className="hover:text-indigo-600">Hiring Dashboard</Link></li>
                <li><Link to="/recruiter/jobs" className="hover:text-indigo-600">Manage Job Postings</Link></li>
                <li><Link to="/login" className="hover:text-indigo-600">Employer Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Identity Microservice</li>
                <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Hiring Microservice</li>
                <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Notification Microservice</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© {new Date().getFullYear()} HireFlow Platform. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-600">Privacy Policy</span>
              <span className="hover:text-slate-600">Terms of Service</span>
              <span className="hover:text-slate-600">OpenAPI Spec</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
