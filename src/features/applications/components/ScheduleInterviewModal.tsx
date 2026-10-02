import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/ToastContext';
import { interviewsApi } from '../../interviews/api/interviewsApi';
import { ScheduleInterviewData, InterviewType } from '../../interviews/types';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateEmail?: string;
  onSuccess: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  candidateEmail,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Set default start time 1 day in future
  const tomorrow = new Date(Date.now() + 86400000);
  const defaultStartStr = tomorrow.toISOString().slice(0, 16);
  const defaultEndStr = new Date(tomorrow.getTime() + 3600000).toISOString().slice(0, 16);

  const [title, setTitle] = useState('Technical Screening');
  const [type, setType] = useState<InterviewType>('Technical');
  const [startTime, setStartTime] = useState(defaultStartStr);
  const [endTime, setEndTime] = useState(defaultEndStr);
  const [interviewerEmailsStr, setInterviewerEmailsStr] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/abc-defg-hij');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !startTime || !endTime) {
      addToast('Please fill in interview title and start/end time.', 'error');
      return;
    }

    const startUtc = new Date(startTime).toISOString();
    const endUtc = new Date(endTime).toISOString();

    if (new Date(endUtc) <= new Date(startUtc)) {
      addToast('End time must be after start time.', 'error');
      return;
    }

    const interviewerEmails = interviewerEmailsStr
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    setLoading(true);
    try {
      const payload: ScheduleInterviewData = {
        title: title.trim(),
        type,
        startTimeUtc: startUtc,
        endTimeUtc: endUtc,
        interviewerEmails,
        meetingUrl: meetingUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await interviewsApi.scheduleInterview(applicationId, payload);
      addToast('Interview scheduled successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to schedule interview', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Candidate Interview" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {candidateEmail && (
          <div className="p-3 bg-indigo-50 rounded-lg text-xs text-indigo-900 border border-indigo-100 font-medium">
            Scheduling interview for candidate: <span className="font-bold">{candidateEmail}</span>
          </div>
        )}

        <Input
          label="Interview Title"
          required
          placeholder="e.g. Technical Round 1 - System Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label="Interview Type"
          value={type}
          onChange={(e) => setType(e.target.value as InterviewType)}
          options={[
            { label: 'Technical Screening', value: 'Technical' },
            { label: 'HR Screening', value: 'HR' },
            { label: 'Cultural Fit', value: 'CulturalFit' },
            { label: 'Final Round', value: 'Final' },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>

        <Input
          label="Interviewer Emails (comma separated)"
          placeholder="interviewer1@company.com, lead@company.com"
          value={interviewerEmailsStr}
          onChange={(e) => setInterviewerEmailsStr(e.target.value)}
        />

        <Input
          label="Meeting URL (Google Meet / Zoom / Teams)"
          placeholder="https://meet.google.com/..."
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Notes / Instructions for Candidate
          </label>
          <textarea
            rows={3}
            placeholder="Please have your IDE ready for live coding..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Schedule Interview
          </Button>
        </div>
      </form>
    </Modal>
  );
};
