import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastContext';
import { jobsApi } from '../api/jobsApi';
import { AlertTriangle } from 'lucide-react';

interface CloseJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onSuccess: () => void;
}

export const CloseJobModal: React.FC<CloseJobModalProps> = ({
  isOpen,
  onClose,
  jobId,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleCloseJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      addToast('Please provide a reason for closing this job listing.', 'error');
      return;
    }
    setLoading(true);
    try {
      await jobsApi.closeJob(jobId, reason.trim());
      addToast('Job listing closed successfully.', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to close job listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Close Job Opening" maxWidth="max-w-md">
      <form onSubmit={handleCloseJob} className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            Closing this job listing will prevent candidates from submitting new applications. Existing applications remain accessible.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Reason for Closing <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Position filled, Hiring freeze, Requirements updated..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={loading}>
            Confirm Close Job
          </Button>
        </div>
      </form>
    </Modal>
  );
};
