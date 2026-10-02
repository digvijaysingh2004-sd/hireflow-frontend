import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviewsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { useToast } from '../../../components/ui/ToastContext';
import { Calendar, Video, Clock, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';
import { Interview, InterviewStatus } from '../types';

export const RecruiterInterviewsPage: React.FC = () => {
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recruiter-interviews', statusFilter],
    queryFn: () =>
      interviewsApi.getInterviews(
        statusFilter !== 'ALL' ? { status: statusFilter as InterviewStatus } : undefined
      ),
  });

  const interviews = data?.data || [];

  const filteredInterviews = interviews.filter((item) => {
    if (!searchTerm.trim()) return true;
    const title = item.title?.toLowerCase() || '';
    const emails = item.interviewerEmails?.join(' ')?.toLowerCase() || '';
    return title.includes(searchTerm.toLowerCase()) || emails.includes(searchTerm.toLowerCase());
  });

  const handleUpdateStatus = async (interviewId: string, status: InterviewStatus) => {
    try {
      await interviewsApi.updateInterviewStatus(interviewId, status);
      addToast(`Interview status updated to ${status}`, 'success');
      refetch();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to update status', 'error');
    }
  };

  const getStatusVariant = (status: InterviewStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: Column<Interview>[] = [
    {
      header: 'Interview Title & Type',
      accessor: (item) => (
        <div>
          <span className="font-bold text-slate-900 text-sm block">{item.title}</span>
          {item.type && (
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {item.type}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Date & Time',
      accessor: (item) => {
        const start = new Date(item.startTimeUtc);
        const end = new Date(item.endTimeUtc);
        return (
          <div className="text-xs space-y-0.5">
            <span className="font-semibold text-slate-800 block">
              {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-slate-500 block">
              {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Meeting Link',
      accessor: (item) => (
        <div>
          {item.meetingUrl ? (
            <a
              href={item.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Meeting</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-xs text-slate-400 italic">No link</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (item) => (
        <Badge variant={getStatusVariant(item.status)} size="sm">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === 'Scheduled' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-600 hover:bg-emerald-50"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={() => handleUpdateStatus(item.id, 'Completed')}
              >
                Mark Complete
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                icon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Scheduled Interviews Calendar</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track interview times, access virtual rooms, and record interview completion status.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search interview title or interviewer..."
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
              { label: 'All Interview Statuses', value: 'ALL' },
              { label: 'Scheduled', value: 'Scheduled' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' },
              { label: 'Rescheduled', value: 'Rescheduled' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredInterviews}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyMessage="No scheduled interviews found."
        />
      </div>
    </div>
  );
};
