import React, { useState } from 'react';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/ToastContext';
import { applicationsApi } from '../api/applicationsApi';
import { Application, ApplicationStatus } from '../types';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import {
  User,
  Mail,
  FileText,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ApplicantScreeningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSuccess: () => void;
}

export const ApplicantScreeningDrawer: React.FC<ApplicantScreeningDrawerProps> = ({
  isOpen,
  onClose,
  application,
  onSuccess,
}) => {
  const { addToast } = useToast();
  const [newStatus, setNewStatus] = useState<ApplicationStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  if (!application) return null;

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    setUpdating(true);
    try {
      await applicationsApi.updateApplicationStatus(application.id, {
        status: newStatus,
        note: statusNote.trim() || undefined,
      });
      addToast(`Application status updated to ${newStatus}`, 'success');
      onSuccess();
      setStatusNote('');
      setNewStatus('');
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to update application status', 'error');
    } finally {
      setUpdating(false);
    }
  };

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
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Applicant Screening & Review"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-slate-900 text-base">
                  {application.candidateEmail || 'Candidate'}
                </span>
              </div>
              <Badge variant={getStatusVariant(application.status)} size="md">
                {application.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>Job: {application.jobTitle || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Applied: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Resume & Documents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Submitted Documents
            </h4>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-800">Resume / CV</span>
                </div>
                {application.resumeUrl ? (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <span>View Resume</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">No document link attached</span>
                )}
              </div>

              {application.coverLetter && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Cover Letter</span>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 max-h-40 overflow-y-auto leading-relaxed">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action: Schedule Interview */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Schedule Candidate Interview</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Set date, time, and video meeting details for technical or HR screening.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => setIsScheduleModalOpen(true)}
            >
              Schedule
            </Button>
          </div>

          {/* Update Application Status */}
          <form onSubmit={handleStatusChange} className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transition Status
            </h4>

            <Select
              label="Select Next Stage"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
              options={[
                { label: '-- Select Status --', value: '' },
                { label: 'Under Review', value: 'UnderReview' },
                { label: 'Shortlisted', value: 'Shortlisted' },
                { label: 'Interview Scheduled', value: 'InterviewScheduled' },
                { label: 'Offered', value: 'Offered' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Internal Review Note
              </label>
              <textarea
                rows={3}
                placeholder="Reason for status change, feedback, or interview observations..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={updating}
              disabled={!newStatus}
            >
              Update Stage Status
            </Button>
          </form>
        </div>
      </Drawer>

      {isScheduleModalOpen && (
        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          applicationId={application.id}
          candidateEmail={application.candidateEmail}
          onSuccess={() => {
            onSuccess();
          }}
        />
      )}
    </>
  );
};
