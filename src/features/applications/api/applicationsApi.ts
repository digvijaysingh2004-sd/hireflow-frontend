import { hiringClient, generateCorrelationId } from '../../../lib/apiClient';
import { ApiEnvelope } from '../../auth/types';
import {
  Application,
  SubmitApplicationData,
  ApplicationFilterParams,
  UpdateApplicationStatusData,
  ApplicationTimelineItem,
} from '../types';

export const applicationsApi = {
  async submitApplication(
    jobId: string,
    data: SubmitApplicationData,
    idempotencyKey?: string
  ): Promise<Application> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    } else {
      headers['Idempotency-Key'] = generateCorrelationId();
    }

    const response = await hiringClient.post(`/api/v1/jobs/${jobId}/applications`, data, {
      headers,
    });
    return response.data.data || response.data;
  },

  async getMyApplications(params?: ApplicationFilterParams): Promise<ApiEnvelope<Application[]>> {
    const response = await hiringClient.get('/api/v1/me/applications', { params });
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

  async getMyApplicationById(applicationId: string): Promise<Application> {
    const response = await hiringClient.get(`/api/v1/me/applications/${applicationId}`);
    return response.data.data || response.data;
  },

  async withdrawApplication(
    applicationId: string,
    reason: string
  ): Promise<{ applicationId: string; status: string }> {
    const response = await hiringClient.post(`/api/v1/applications/${applicationId}/withdraw`, {
      reason,
    });
    return response.data.data || response.data;
  },

  async getJobApplications(
    jobId: string,
    params?: ApplicationFilterParams
  ): Promise<ApiEnvelope<Application[]>> {
    const response = await hiringClient.get(`/api/v1/jobs/${jobId}/applications`, { params });
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

  async getApplicationById(applicationId: string): Promise<Application> {
    const response = await hiringClient.get(`/api/v1/applications/${applicationId}`);
    return response.data.data || response.data;
  },

  async updateApplicationStatus(
    applicationId: string,
    data: UpdateApplicationStatusData
  ): Promise<{ applicationId: string; previousStatus: string; status: string }> {
    const response = await hiringClient.patch(
      `/api/v1/applications/${applicationId}/status`,
      data
    );
    return response.data.data || response.data;
  },

  async getApplicationHistory(applicationId: string): Promise<ApplicationTimelineItem[]> {
    const response = await hiringClient.get(`/api/v1/applications/${applicationId}/history`);
    return response.data.data || response.data;
  },
};
