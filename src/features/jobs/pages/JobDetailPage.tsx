import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Building2,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useJobDetailQuery } from '../hooks/useJobsQuery';
import { useAuth } from '../../auth/hooks/useAuth';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { applicationsApi } from '../../applications/api/applicationsApi';
import { useToast } from '../../../components/ui/ToastContext';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const { data: job, isLoading, isError, error } = useJobDetailQuery(id);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatSalary = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      await applicationsApi.submitApplication(id, {
        coverNote,
        resumeUrl: resumeUrl || 'https://storage.example.com/resumes/default-resume.pdf',
      });
      setSubmitSuccess(true);
      showToast('success', 'Application submitted successfully!');
      setTimeout(() => {
        setIsApplyModalOpen(false);
        navigate('/candidate/applications');
      }, 1500);
    } catch (err: unknown) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to submit application. You may have already applied.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 rounded-xl space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-32 bg-slate-100 rounded" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h2>
        <p className="text-slate-600 text-sm mb-4">
          {error instanceof Error ? error.message : 'The requested job posting is unavailable.'}
        </p>
        <Link to="/jobs">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Jobs
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
              <Building2 className="w-4 h-4" />
              {job.company?.name || 'HireFlow Client Partner'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-3">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {job.employmentType} {job.workMode ? `(${job.workMode})` : ''}
              </span>
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <IndianRupee className="w-4 h-4" />
                  {job.salaryMin ? formatSalary(job.salaryMin) : '0'} - {job.salaryMax ? formatSalary(job.salaryMax) : 'Open'}
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
            <Badge status={job.status} />
            <Button
              onClick={handleApplyClick}
              size="lg"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Job Description & Requirements
          </h3>
          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-xl border border-slate-100">
            {job.description}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Published:{' '}
            {job.publishedAtUtc ? new Date(job.publishedAtUtc).toLocaleDateString() : 'N/A'}
          </span>
          {job.closingAtUtc && (
            <span>Closing Date: {new Date(job.closingAtUtc).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        {submitSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-slate-600 text-sm">Redirecting to your applications dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Candidate Info
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                Logged in as <strong>{user?.email}</strong>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Resume URL / Document Link
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://storage.example.com/resumes/my-resume.pdf"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cover Note / Message to Recruiter
              </label>
              <textarea
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly state why you're a great fit for this position..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
