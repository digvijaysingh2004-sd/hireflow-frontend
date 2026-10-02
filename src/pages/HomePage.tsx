import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { MOCK_JOBS } from '../features/jobs/mockData';
import { JobCard } from '../features/jobs/components/JobCard';
import { useAuth } from '../features/auth/hooks/useAuth';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const featuredJobs = MOCK_JOBS.slice(0, 3);

  const isRecruiter = user?.roles?.some((r) => r === 'Recruiter' || r === 'Admin' || r === 'HiringManager');

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Powered by .NET 10 & React 18 Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            Hire the Next Generation of Tech Talent.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            HireFlow streamlines the end-to-end recruitment lifecycle with secure email OTP verification, real-time application status tracking, and automated interview scheduling.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] text-sm cursor-pointer"
            >
              <Search className="w-4 h-4" /> Explore Open Roles
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all text-sm backdrop-blur-xs cursor-pointer"
              >
                Create Free Candidate Account <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={isRecruiter ? '/recruiter/dashboard' : '/candidate/applications'}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm cursor-pointer"
              >
                Go to Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-300">
            <div>
              <div className="text-2xl font-extrabold text-white">100+</div>
              <div className="text-xs text-slate-400 font-medium">Verified Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-400">15 min</div>
              <div className="text-xs text-slate-400 font-medium">JWT Token Expiry</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">99.8%</div>
              <div className="text-xs text-slate-400 font-medium">API Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-400">Microservice</div>
              <div className="text-xs text-slate-400 font-medium">Distributed Scale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Engineering Categories
            </h2>
            <p className="text-slate-500 text-sm">Discover high-demand engineering and design roles.</p>
          </div>
          <Link
            to="/jobs"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/jobs?search=Backend"
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600">
              Backend Architecture
            </h3>
            <p className="text-xs text-slate-500">C#, .NET 10, PostgreSQL, Microservices</p>
          </Link>

          <Link
            to="/jobs?search=Frontend"
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600">
              Frontend Development
            </h3>
            <p className="text-xs text-slate-500">React 18, TypeScript, Tailwind CSS</p>
          </Link>

          <Link
            to="/jobs?search=DevOps"
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600">
              DevOps & Infrastructure
            </h3>
            <p className="text-xs text-slate-500">Docker, Kubernetes, CI/CD pipelines</p>
          </Link>

          <Link
            to="/jobs?search=Management"
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600">
              Engineering Leadership
            </h3>
            <p className="text-xs text-slate-500">Managers, Tech Leads, Product Owners</p>
          </Link>
        </div>
      </section>

      {/* Featured Jobs Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 text-sm">Top hand-picked positions open for applications right now.</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Explore All Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* How HireFlow Works Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Platform Workflows
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How HireFlow Powers Recruitment
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Designed to connect candidates and recruiters with zero friction and enterprise-grade security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Register & OTP Verify</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a candidate account and verify your identity via 6-digit email OTP.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">One-Click Applications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit applications directly with client-generated idempotency keys to prevent duplicates.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Real-Time Status & Interviews</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track status history from Under Review to Shortlisted and join scheduled interviews seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Tech Guarantee */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Built for Modern Enterprise Engineering
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Stateless JWT tokens, 15-minute access token rotation, rate limiting, and PostgreSQL transactional outbox publishing.
          </p>
        </div>
        <Link
          to="/jobs"
          className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
        >
          Browse All Jobs Now
        </Link>
      </section>
    </div>
  );
};
