export type InterviewStatus = 'Scheduled' | 'Rescheduled' | 'Cancelled' | 'Completed' | 'NoShow';
export type InterviewType = 'Technical' | 'Behavioral' | 'HR' | 'SystemDesign' | 'Final';

export interface Interview {
  id: string;
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
  startsAtUtc: string;
  endsAtUtc: string;
  timezone?: string;
  meetingUrl?: string;
  interviewType?: InterviewType;
  panelistUserIds?: string[];
  notes?: string;
  status: InterviewStatus;
  createdAtUtc: string;
}

export interface ScheduleInterviewData {
  startsAtUtc: string;
  endsAtUtc: string;
  timezone?: string;
  meetingUrl?: string;
  interviewType?: InterviewType;
  panelistUserIds?: string[];
  notes?: string;
}

export interface InterviewFilterParams {
  status?: InterviewStatus;
  fromUtc?: string;
  toUtc?: string;
  page?: number;
  pageSize?: number;
}
