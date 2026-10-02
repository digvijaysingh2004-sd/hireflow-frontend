import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  UserCheck,
  PlusCircle,
  Users,
  Activity,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRecruiterOrAdmin = user?.roles?.some(
    (r) => r === 'Recruiter' || r === 'Admin' || r === 'HiringManager'
  );
  const isAdmin = user?.roles?.includes('Admin');

  const navItems = isRecruiterOrAdmin
    ? [
        { label: 'Hiring Dashboard', path: '/recruiter/dashboard', icon: Activity },
        { label: 'Jobs Table', path: '/recruiter/jobs', icon: Briefcase },
        { label: 'Applicants', path: '/recruiter/applications', icon: UserCheck },
        { label: 'Scheduled Interviews', path: '/recruiter/interviews', icon: Calendar },
        ...(isAdmin
          ? [
              { label: 'User Management', path: '/admin/users', icon: Users },
              { label: 'Audit Log', path: '/admin/audit-logs', icon: Shield },
            ]
          : []),
      ]
    : [
        { label: 'My Applications', path: '/candidate/applications', icon: FileText },
        { label: 'My Interviews', path: '/candidate/interviews', icon: Calendar },
        { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
      ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        <div className="h-16 px-6 flex items-center gap-2 border-b border-slate-800 font-bold text-xl text-white">
          <Briefcase className="w-6 h-6 text-indigo-400" />
          <span>HireFlow</span>
        </div>

        <div className="px-6 py-4 border-b border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Logged in as
          </div>
          <div className="font-semibold text-sm text-white truncate">{user?.email}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {user?.roles?.map((r) => (
              <span
                key={r}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-indigo-400">
          <Briefcase className="w-5 h-5" />
          <span>HireFlow</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-base">
            {navItems.find((i) => i.path === location.pathname)?.label || 'Portal Overview'}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{user?.email}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
