import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, ArrowRight, Building2 } from 'lucide-react';
import { Job } from '../types';
import { Badge } from '../../../components/ui/Badge';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              {job.company?.name || 'HireFlow Client Partner'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
          </div>
          <Badge status={job.status} />
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500 mb-4">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.employmentType} {job.workMode ? `• ${job.workMode}` : ''}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              {job.salaryMin ? formatSalary(job.salaryMin) : '0'} - {job.salaryMax ? formatSalary(job.salaryMax) : 'Open'}
            </span>
          )}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-[11px]">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Posted {job.publishedAtUtc ? new Date(job.publishedAtUtc).toLocaleDateString() : 'Recently'}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
