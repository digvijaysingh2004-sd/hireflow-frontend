import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { Button } from '../../../components/ui/Button';
import {
  Activity,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { data: summary, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.getDashboardSummary(),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-2xl text-white shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>Hiring Analytics & KPI Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recruitment Dashboard</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Real-time pipeline statistics, application conversions, and candidate screening metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recruiter/jobs">
            <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {isLoading ? '...' : summary?.activeJobsCount ?? 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open openings published</span>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {isLoading ? '...' : summary?.totalApplicationsCount ?? 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Total candidate submissions</span>
          </div>
        </div>

        {/* Scheduled Interviews */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {isLoading ? '...' : summary?.scheduledInterviewsCount ?? 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span>Scheduled & ongoing</span>
          </div>
        </div>

        {/* Hired / Offers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Hired Candidates</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {isLoading ? '...' : summary?.hiredCount ?? 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Offers extended & accepted</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Manage Jobs Table</h3>
            <p className="text-xs text-slate-500 mt-1">
              Create, publish, edit, or close job listings for engineering and product teams.
            </p>
          </div>
          <Link to="/recruiter/jobs">
            <Button variant="secondary" size="sm" className="w-full justify-between mt-2">
              <span>Go to Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Screen Applicants</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review submitted resumes, progress candidates through stages, or send rejection feedback.
            </p>
          </div>
          <Link to="/recruiter/applications">
            <Button variant="secondary" size="sm" className="w-full justify-between mt-2">
              <span>View Applicants</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Interviews Calendar</h3>
            <p className="text-xs text-slate-500 mt-1">
              Access Google Meet / video room links, view interviewers list, and log completion notes.
            </p>
          </div>
          <Link to="/recruiter/interviews">
            <Button variant="secondary" size="sm" className="w-full justify-between mt-2">
              <span>View Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
