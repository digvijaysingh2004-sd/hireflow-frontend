import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '../api/applicationsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { WithdrawApplicationModal } from '../components/WithdrawApplicationModal';
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ban,
  User,
  ExternalLink,
} from 'lucide-react';
import { ApplicationStatus } from '../types';

export const CandidateApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const {
    data: application,
    isLoading: isLoadingApp,
    isError: isErrorApp,
    refetch: refetchApp,
  } = useQuery({
    queryKey: ['application-detail', id],
    queryFn: () => applicationsApi.getMyApplicationById(id!),
    enabled: !!id,
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['application-history', id],
    queryFn: () => applicationsApi.getApplicationHistory(id!),
    enabled: !!id,
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

  if (isLoadingApp) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 max-w-4xl mx-auto">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading application timeline...</p>
      </div>
    );
  }

  if (isErrorApp || !application) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 max-w-4xl mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Application Not Found</h2>
        <p className="text-sm text-slate-500">The application details could not be retrieved.</p>
        <Link to="/candidate/applications">
          <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to My Applications
          </Button>
        </Link>
      </div>
    );
  }

  const isWithdrawnOrFinal =
    application.status === 'Withdrawn' ||
    application.status === 'Rejected' ||
    application.status === 'Offered';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/candidate/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        {!isWithdrawnOrFinal && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            icon={<Ban className="w-4 h-4" />}
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            Withdraw Application
          </Button>
        )}
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{application.jobTitle || 'Application Overview'}</h1>
              <Badge variant={getStatusVariant(application.status)} size="md">
                {application.status}
              </Badge>
            </div>
            {application.department && (
              <p className="text-sm text-slate-500 mt-1">Department: {application.department}</p>
            )}
          </div>

          <Link to={`/jobs/${application.jobId}`}>
            <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              View Job Listing
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-medium">Applied Date</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">
              {application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-medium">Candidate Email</span>
            <span className="text-slate-800 font-semibold mt-0.5 block truncate">
              {application.candidateEmail || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-medium">Last Updated</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">
              {application.updatedAt ? new Date(application.updatedAt).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Timeline & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline History */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Application Stage History</span>
          </h2>

          {isLoadingHistory ? (
            <p className="text-xs text-slate-400">Loading stage history...</p>
          ) : history.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
              Application submitted. Status timeline will update as recruiters review your application.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((item, idx) => (
                <div key={item.id || idx} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-4 ring-white text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{item.status}</span>
                      <span className="text-[11px] text-slate-400">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    {item.note && <p className="text-xs text-slate-600 mt-1 italic">"{item.note}"</p>}
                    {item.updatedBy && (
                      <p className="text-[11px] text-slate-400 mt-1">Updated by: {item.updatedBy}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Candidate Snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 h-fit">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400">
            Application Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Resume File</span>
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Resume Link
                </a>
              ) : (
                <span className="text-slate-600 italic">Attached on file</span>
              )}
            </div>

            {application.coverLetter && (
              <div>
                <span className="text-slate-400 block font-medium mb-1">Cover Letter</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed max-h-48 overflow-y-auto">
                  {application.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isWithdrawModalOpen && (
        <WithdrawApplicationModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          applicationId={id!}
          onSuccess={() => {
            refetchApp();
          }}
        />
      )}
    </div>
  );
};
