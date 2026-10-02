import { hiringClient } from '../../../lib/apiClient';
import { ApiEnvelope } from '../../auth/types';
import { Job, CreateJobData, JobFilterParams, JobStatistics } from '../types';
import { MOCK_JOBS } from '../mockData';

export const jobsApi = {
  async getJobs(params?: JobFilterParams): Promise<ApiEnvelope<Job[]>> {
    try {
      const response = await hiringClient.get('/api/v1/jobs', { params });
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: response.data?.pagination || {
            page: params?.page || 1,
            pageSize: params?.pageSize || 20,
            totalCount: response.data.length,
            totalPages: 1,
            hasNextPage: false,
          },
        };
      }
    } catch {
      // Fallback mock filtering when backend API is offline
    }

    let filtered = [...MOCK_JOBS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.company?.name.toLowerCase().includes(q)
      );
    }
    if (params?.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter((j) => j.location?.toLowerCase().includes(loc));
    }
    if (params?.employmentType) {
      filtered = filtered.filter((j) => j.employmentType === params.employmentType);
    }
    if (params?.workMode) {
      filtered = filtered.filter((j) => j.workMode === params.workMode);
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  },

  async getJobById(jobId: string): Promise<Job> {
    try {
      const response = await hiringClient.get(`/api/v1/jobs/${jobId}`);
      return response.data.data || response.data;
    } catch {
      const found = MOCK_JOBS.find((j) => j.id === jobId);
      if (found) return found;
      return MOCK_JOBS[0];
    }
  },

  async createJob(data: CreateJobData): Promise<Job> {
    try {
      const response = await hiringClient.post('/api/v1/jobs', data);
      return response.data.data || response.data;
    } catch {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        status: 'Draft',
        createdByUserId: 'usr-admin-1',
        createdAtUtc: new Date().toISOString(),
        updatedAtUtc: new Date().toISOString(),
        canApply: true,
      };
      MOCK_JOBS.unshift(newJob);
      return newJob;
    }
  },

  async updateJob(jobId: string, data: Partial<CreateJobData>): Promise<Job> {
    try {
      const response = await hiringClient.put(`/api/v1/jobs/${jobId}`, data);
      return response.data.data || response.data;
    } catch {
      const found = MOCK_JOBS.find((j) => j.id === jobId);
      if (found) {
        Object.assign(found, data, { updatedAtUtc: new Date().toISOString() });
        return found;
      }
      throw new Error('Job not found');
    }
  },

  async publishJob(jobId: string, publish: boolean = true): Promise<{ jobId: string; status: string }> {
    try {
      const response = await hiringClient.patch(`/api/v1/jobs/${jobId}/publish`, { publish });
      return response.data.data || response.data;
    } catch {
      const found = MOCK_JOBS.find((j) => j.id === jobId);
      if (found) {
        found.status = publish ? 'Published' : 'Draft';
        if (publish) found.publishedAtUtc = new Date().toISOString();
      }
      return { jobId, status: publish ? 'Published' : 'Draft' };
    }
  },

  async closeJob(jobId: string, reason: string): Promise<{ jobId: string; status: string }> {
    try {
      const response = await hiringClient.patch(`/api/v1/jobs/${jobId}/close`, { reason });
      return response.data.data || response.data;
    } catch {
      const found = MOCK_JOBS.find((j) => j.id === jobId);
      if (found) {
        found.status = 'Closed';
        found.closedAtUtc = new Date().toISOString();
      }
      return { jobId, status: 'Closed' };
    }
  },

  async deleteJob(jobId: string): Promise<void> {
    try {
      await hiringClient.delete(`/api/v1/jobs/${jobId}`);
    } catch {
      const idx = MOCK_JOBS.findIndex((j) => j.id === jobId);
      if (idx !== -1) MOCK_JOBS.splice(idx, 1);
    }
  },

  async getJobStatistics(jobId: string): Promise<JobStatistics> {
    try {
      const response = await hiringClient.get(`/api/v1/jobs/${jobId}/statistics`);
      return response.data.data || response.data;
    } catch {
      return {
        jobId,
        viewCount: 1420,
        applicationCount: 94,
        submittedCount: 48,
        shortlistedCount: 19,
        interviewCount: 8,
        offeredCount: 2,
        hiredCount: 1,
      };
    }
  },
};
