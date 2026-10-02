import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/ToastContext';
import { jobsApi } from '../api/jobsApi';
import { CreateJobData, EmploymentType, WorkMode } from '../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    department: '',
    location: '',
    employmentType: 'FullTime',
    workMode: 'Remote',
    salaryMin: undefined,
    salaryMax: undefined,
    currency: 'USD',
    description: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.department.trim() || !formData.description.trim()) {
      addToast('Please fill in all required job fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await jobsApi.createJob(formData);
      addToast('Job posting created successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to create job posting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post New Job Opening" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            required
            placeholder="e.g., Senior Fullstack Engineer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Input
            label="Department"
            required
            placeholder="e.g., Engineering, Marketing"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />

          <Input
            label="Location"
            required
            placeholder="e.g., San Francisco, CA or Remote"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Select
            label="Employment Type"
            value={formData.employmentType}
            onChange={(e) =>
              setFormData({ ...formData, employmentType: e.target.value as EmploymentType })
            }
            options={[
              { label: 'Full Time', value: 'FullTime' },
              { label: 'Part Time', value: 'PartTime' },
              { label: 'Contract', value: 'Contract' },
              { label: 'Internship', value: 'Internship' },
            ]}
          />

          <Select
            label="Work Mode"
            value={formData.workMode}
            onChange={(e) => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
            options={[
              { label: 'Remote', value: 'Remote' },
              { label: 'Hybrid', value: 'Hybrid' },
              { label: 'Onsite', value: 'Onsite' },
            ]}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min Salary ($)"
              type="number"
              placeholder="100000"
              value={formData.salaryMin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salaryMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <Input
              label="Max Salary ($)"
              type="number"
              placeholder="150000"
              value={formData.salaryMax || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salaryMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Provide a detailed description of responsibilities, team structure..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Requirements & Qualifications
          </label>
          <textarea
            rows={3}
            placeholder="Key technical skills, years of experience, certifications..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Create Job Listing
          </Button>
        </div>
      </form>
    </Modal>
  );
};
