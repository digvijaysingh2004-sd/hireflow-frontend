export type JobStatus = 'Draft' | 'Published' | 'Closed';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' | 'Internship';
export type WorkMode = 'Onsite' | 'Hybrid' | 'Remote';

export interface Company {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  description?: string;
  industry?: string;
  location?: string;
}

export interface Job {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  slug: string;
  description: string;
  location?: string;
  employmentType: EmploymentType;
  workMode?: WorkMode;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  status: JobStatus;
  createdByUserId: string;
  publishedAtUtc?: string;
  closingAtUtc?: string;
  closedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  canApply?: boolean;
}

export interface CreateJobData {
  companyId: string;
  title: string;
  description: string;
  location?: string;
  employmentType: EmploymentType;
  workMode?: WorkMode;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  closingAtUtc?: string;
}

export interface JobFilterParams {
  search?: string;
  status?: JobStatus;
  location?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  minExperience?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface JobStatistics {
  jobId: string;
  viewCount: number;
  applicationCount: number;
  submittedCount: number;
  shortlistedCount: number;
  interviewCount: number;
  offeredCount: number;
  hiredCount: number;
}
