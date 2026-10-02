import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../api/applicationsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { WithdrawApplicationModal } from '../components/WithdrawApplicationModal';
import { FileText, Eye, Ban, Search, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { ApplicationStatus } from '../types';

export const CandidateApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-applications', statusFilter],
    queryFn: () =>
      applicationsApi.getMyApplications(
        statusFilter !== 'ALL' ? { status: statusFilter as ApplicationStatus } : undefined
      ),
  });

  const applications = data?.data || [];

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const title = app.jobTitle?.toLowerCase() || '';
    const dept = app.department?.toLowerCase() || '';
    return title.includes(searchTerm.toLowerCase()) || dept.includes(searchTerm.toLowerCase());
  });

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return 'info';
      case 'UnderReview':
        return 'warning';
      case 'Shortlisted':
      case 'InterviewScheduled':
        return 'primary';
      case 'Offered':
        return 'success';
      case 'Rejected':
      case 'Withdrawn':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>My Applications</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track your job application status, interview schedules, and application timeline history.
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="primary" icon={<Briefcase className="w-4 h-4" />}>
            Explore Open Positions
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-full md:w-60">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Submitted', value: 'Submitted' },
              { label: 'Under Review', value: 'UnderReview' },
              { label: 'Shortlisted', value: 'Shortlisted' },
              { label: 'Interview Scheduled', value: 'InterviewScheduled' },
              { label: 'Offered', value: 'Offered' },
              { label: 'Rejected', value: 'Rejected' },
              { label: 'Withdrawn', value: 'Withdrawn' },
            ]}
          />
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Fetching your application history...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center space-y-3">
          <p className="text-red-700 text-sm font-semibold">
            {(error as any)?.response?.data?.error?.message || 'Failed to load applications.'}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">No applications found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or status filter.'
                : 'You have not submitted any job applications yet.'}
            </p>
          </div>
          {!searchTerm && statusFilter === 'ALL' && (
            <Link to="/jobs">
              <Button variant="primary" size="sm">
                Browse Jobs
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base">{app.jobTitle || 'Job Application'}</h3>
                  <Badge variant={getStatusVariant(app.status)} size="sm">
                    {app.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  {app.department && <span>Department: {app.department}</span>}
                  {app.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {app.candidateEmail && <span>Candidate: {app.candidateEmail}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <Link to={`/candidate/applications/${app.id}`}>
                  <Button variant="secondary" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                    View Timeline
                  </Button>
                </Link>

                {app.status !== 'Withdrawn' && app.status !== 'Rejected' && app.status !== 'Offered' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    icon={<Ban className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedAppId(app.id)}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppId && (
        <WithdrawApplicationModal
          isOpen={!!selectedAppId}
          onClose={() => setSelectedAppId(null)}
          applicationId={selectedAppId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};
