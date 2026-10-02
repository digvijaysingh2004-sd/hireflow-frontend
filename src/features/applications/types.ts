import { Job } from '../jobs/types';

export type ApplicationStatus =
  | 'Submitted'
  | 'UnderReview'
  | 'Shortlisted'
  | 'InterviewScheduled'
  | 'Offered'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationTimelineItem {
  fromStatus?: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedByUserId?: string;
  comment?: string;
  changedAtUtc: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  candidateUserId: string;
  candidateName?: string;
  candidateEmail?: string;
  resumeUrl?: string;
  coverNote?: string;
  status: ApplicationStatus;
  appliedAtUtc: string;
  updatedAtUtc?: string;
  timeline?: ApplicationTimelineItem[];
}

export interface SubmitApplicationData {
  resumeUrl?: string;
  coverNote?: string;
  source?: string;
}

export interface ApplicationFilterParams {
  jobId?: string;
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface UpdateApplicationStatusData {
  status: ApplicationStatus;
  comment?: string;
}
