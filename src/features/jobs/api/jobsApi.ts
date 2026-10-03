import { hiringClient } from '../../../lib/apiClient';
import { ApiEnvelope } from '../../auth/types';
import { Job, CreateJobData, JobFilterParams, JobStatistics } from '../types';

export const jobsApi = {
  async getJobs(params?: JobFilterParams): Promise<ApiEnvelope<Job[]>> {
    const response = await hiringClient.get('/api/v1/jobs', { params });
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data;
    }
    return {
      data: Array.isArray(response.data) ? response.data : [],
      pagination: response.data?.pagination || {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
        totalCount: Array.isArray(response.data) ? response.data.length : 0,
        totalPages: 1,
        hasNextPage: false,
      },
    };
  },

  async getJobById(jobId: string): Promise<Job> {
    const response = await hiringClient.get(`/api/v1/jobs/${jobId}`);
    return response.data.data || response.data;
  },

  async createJob(data: CreateJobData): Promise<Job> {
    const response = await hiringClient.post('/api/v1/jobs', data);
    return response.data.data || response.data;
  },

  async updateJob(jobId: string, data: Partial<CreateJobData>): Promise<Job> {
    const response = await hiringClient.put(`/api/v1/jobs/${jobId}`, data);
    return response.data.data || response.data;
  },

  async publishJob(jobId: string, publish: boolean = true): Promise<{ jobId: string; status: string }> {
    const response = await hiringClient.patch(`/api/v1/jobs/${jobId}/publish`, { publish });
    return response.data.data || response.data;
  },

  async closeJob(jobId: string, reason: string): Promise<{ jobId: string; status: string }> {
    const response = await hiringClient.patch(`/api/v1/jobs/${jobId}/close`, { reason });
    return response.data.data || response.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await hiringClient.delete(`/api/v1/jobs/${jobId}`);
  },

  async getJobStatistics(jobId: string): Promise<JobStatistics> {
    const response = await hiringClient.get(`/api/v1/jobs/${jobId}/statistics`);
    return response.data.data || response.data;
  },

  async getCompanies(): Promise<any[]> {
    const response = await hiringClient.get('/api/v1/companies');
    if (response.data?.items && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async createCompany(data: { name: string; website?: string; description?: string }): Promise<any> {
    const response = await hiringClient.post('/api/v1/companies', data);
    return response.data.data || response.data;
  },
};

