import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { applicationsApi } from '../api/applicationsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { ApplicantScreeningDrawer } from '../components/ApplicantScreeningDrawer';
import { UserCheck, Search, Eye, Calendar, FileText } from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

export const RecruiterApplicationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobId, setJobId] = useState<string>(initialJobId);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recruiter-applications', jobId, statusFilter],
    queryFn: () => {
      const params = statusFilter !== 'ALL' ? { status: statusFilter as ApplicationStatus } : undefined;
      if (jobId) {
        return applicationsApi.getJobApplications(jobId, params);
      }
      return applicationsApi.getMyApplications(params);
    },
  });

  const applications = data?.data || [];

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const email = app.candidateEmail?.toLowerCase() || '';
    const title = app.jobTitle?.toLowerCase() || '';
    return email.includes(searchTerm.toLowerCase()) || title.includes(searchTerm.toLowerCase());
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

  const columns: Column<Application>[] = [
    {
      header: 'Candidate Email',
      accessor: (app) => (
        <span className="font-semibold text-slate-900 text-sm">
          {app.candidateEmail || 'Candidate'}
        </span>
      ),
    },
    {
      header: 'Job Title',
      accessor: (app) => (
        <div>
          <span className="font-medium text-slate-800 text-sm">{app.jobTitle || 'Job Position'}</span>
          {app.department && <span className="block text-xs text-slate-500">{app.department}</span>}
        </div>
      ),
    },
    {
      header: 'Stage Status',
      accessor: (app) => (
        <Badge variant={getStatusVariant(app.status)} size="sm">
          {app.status}
        </Badge>
      ),
    },
    {
      header: 'Applied Date',
      accessor: (app) => (
        <span className="text-xs text-slate-500">
          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (app) => (
        <div className="flex items-center justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => setSelectedApplication(app)}
          >
            Review Candidate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            <span>Applicant Screening Portal</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review applicant resumes, transition candidate hiring stages, and schedule interview rounds.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search candidate email or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Application Stages', value: 'ALL' },
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

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredApplications}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyMessage="No candidate applications found."
        />
      </div>

      {selectedApplication && (
        <ApplicantScreeningDrawer
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          application={selectedApplication}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};
