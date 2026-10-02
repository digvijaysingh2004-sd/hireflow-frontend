import React, { useState } from 'react';
import { Briefcase, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { useJobsQuery } from '../hooks/useJobsQuery';
import { JobFilterParams } from '../types';
import { JobCard } from '../components/JobCard';
import { JobSearchFilterBar } from '../components/JobSearchFilterBar';

export const JobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    pageSize: 12,
    status: 'Published',
    sort: '-publishedAt',
  });

  const { data, isLoading, isError, error } = useJobsQuery(filters);

  const jobs = data?.data || [];
  const pagination = data?.pagination || { page: 1, pageSize: 12, totalCount: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Briefcase className="w-3.5 h-3.5" /> Over 100+ Live Tech Roles
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Find Your Next Career Challenge
          </h1>
          <p className="text-slate-300 text-sm">
            Explore verified opportunities from top engineering teams. Apply directly with real-time status tracking.
          </p>
        </div>
      </div>

      <JobSearchFilterBar filters={filters} onFilterChange={setFilters} />

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          Failed to load job listings: {error instanceof Error ? error.message : 'Server error'}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse"
            >
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-16 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Jobs Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any job postings matching your current search parameters. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900">{jobs.length}</strong> of{' '}
              <strong className="text-slate-900">{pagination.totalCount}</strong> published positions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs text-slate-600 font-semibold px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
