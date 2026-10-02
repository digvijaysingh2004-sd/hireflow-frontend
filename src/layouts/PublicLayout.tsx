import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isRecruiterOrAdmin = user?.roles?.some(
    (r) => r === 'Recruiter' || r === 'Admin' || r === 'HiringManager'
  );
  const dashboardPath = isRecruiterOrAdmin ? '/recruiter/dashboard' : '/candidate/applications';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-black text-xl text-indigo-600">
              <Briefcase className="w-6 h-6" />
              <span>HireFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link
                to="/jobs"
                className={`hover:text-indigo-600 transition-colors ${
                  location.pathname === '/jobs' ? 'text-indigo-600 font-bold' : ''
                }`}
              >
                Find Jobs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 text-xs font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          HireFlow Microservice Recruitment Platform • Built with .NET 10 LTS & React 18
        </div>
      </footer>
    </div>
  );
};
