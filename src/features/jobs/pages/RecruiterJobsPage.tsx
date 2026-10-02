import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { useToast } from '../../../components/ui/ToastContext';
import { CreateJobModal } from '../components/CreateJobModal';
import { CloseJobModal } from '../components/CloseJobModal';
import {
  Briefcase,
  Plus,
  Search,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Globe,
} from 'lucide-react';
import { Job, JobStatus } from '../types';

export const RecruiterJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [closeJobId, setCloseJobId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recruiter-jobs', statusFilter],
    queryFn: () =>
      jobsApi.getJobs(statusFilter !== 'ALL' ? { status: statusFilter as JobStatus } : undefined),
  });

  const jobs = data?.data || [];

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm.trim()) return true;
    const title = job.title?.toLowerCase() || '';
    const dept = job.department?.toLowerCase() || '';
    const loc = job.location?.toLowerCase() || '';
    return (
      title.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase()) ||
      loc.includes(searchTerm.toLowerCase())
    );
  });

  const handleTogglePublish = async (job: Job) => {
    const nextStatus = job.status !== 'Published';
    try {
      await jobsApi.publishJob(job.id, nextStatus);
      addToast(
        nextStatus ? `Job "${job.title}" published!` : `Job "${job.title}" reverted to draft.`,
        'success'
      );
      refetch();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to update publish status', 'error');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsApi.deleteJob(jobId);
      addToast('Job posting deleted successfully', 'success');
      refetch();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to delete job', 'error');
    }
  };

  const columns: Column<Job>[] = [
    {
      header: 'Job Title & Details',
      accessor: (job) => (
        <div>
          <Link
            to={`/jobs/${job.id}`}
            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.workMode}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (job) => (
        <Badge
          variant={
            job.status === 'Published'
              ? 'success'
              : job.status === 'Closed'
              ? 'danger'
              : 'default'
          }
          size="sm"
        >
          {job.status}
        </Badge>
      ),
    },
    {
      header: 'Applicants',
      accessor: (job) => (
        <span className="font-semibold text-slate-800 text-sm">{job.applicantCount ?? 0}</span>
      ),
    },
    {
      header: 'Created Date',
      accessor: (job) => (
        <span className="text-xs text-slate-500">
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (job) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={<Users className="w-3.5 h-3.5" />}
            title="View Job Applications"
            onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}
          >
            Applicants
          </Button>

          {job.status !== 'Closed' && (
            <Button
              variant="ghost"
              size="sm"
              icon={job.status === 'Published' ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              title={job.status === 'Published' ? 'Unpublish Job' : 'Publish Job'}
              onClick={() => handleTogglePublish(job)}
            >
              {job.status === 'Published' ? 'Draft' : 'Publish'}
            </Button>
          )}

          {job.status !== 'Closed' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:bg-amber-50"
              icon={<XCircle className="w-3.5 h-3.5" />}
              title="Close Job Listing"
              onClick={() => setCloseJobId(job.id)}
            >
              Close
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            title="Delete Job"
            onClick={() => handleDeleteJob(job.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Jobs Management</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Create new job postings, toggle live publish visibility, or close completed openings.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Post New Job Opening
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by job title, dept, location..."
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
              { label: 'All Job Statuses', value: 'ALL' },
              { label: 'Published', value: 'Published' },
              { label: 'Draft', value: 'Draft' },
              { label: 'Closed', value: 'Closed' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredJobs}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyMessage="No job listings found matching your criteria."
        />
      </div>

      {isCreateModalOpen && (
        <CreateJobModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {closeJobId && (
        <CloseJobModal
          isOpen={!!closeJobId}
          onClose={() => setCloseJobId(null)}
          jobId={closeJobId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};
