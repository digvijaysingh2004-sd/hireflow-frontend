import { hiringClient, generateCorrelationId } from '../../../lib/apiClient';
import { ApiEnvelope } from '../../auth/types';
import { Interview, ScheduleInterviewData, InterviewFilterParams } from '../types';

export const interviewsApi = {
  async scheduleInterview(
    applicationId: string,
    data: ScheduleInterviewData,
    idempotencyKey?: string
  ): Promise<Interview> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    } else {
      headers['Idempotency-Key'] = generateCorrelationId();
    }

    const response = await hiringClient.post(
      `/api/v1/applications/${applicationId}/interviews`,
      data,
      { headers }
    );
    return response.data.data || response.data;
  },

  async getMyInterviews(params?: InterviewFilterParams): Promise<ApiEnvelope<Interview[]>> {
    const response = await hiringClient.get('/api/v1/me/interviews', { params });
    if (response.data?.items && Array.isArray(response.data.items)) {
      return {
        data: response.data.items,
        pagination: {
          page: response.data.page || 1,
          pageSize: response.data.pageSize || 10,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 1,
          hasNextPage: !!response.data.hasNextPage,
        },
      };
    }
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

  async getInterviews(params?: InterviewFilterParams): Promise<ApiEnvelope<Interview[]>> {
    const response = await hiringClient.get('/api/v1/interviews', { params });
    if (response.data?.items && Array.isArray(response.data.items)) {
      return {
        data: response.data.items,
        pagination: {
          page: response.data.page || 1,
          pageSize: response.data.pageSize || 10,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 1,
          hasNextPage: !!response.data.hasNextPage,
        },
      };
    }
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

  async getInterviewById(interviewId: string): Promise<Interview> {
    const response = await hiringClient.get(`/api/v1/interviews/${interviewId}`);
    return response.data.data || response.data;
  },

  async updateInterview(
    interviewId: string,
    data: Partial<ScheduleInterviewData>
  ): Promise<Interview> {
    const response = await hiringClient.patch(`/api/v1/interviews/${interviewId}`, data);
    return response.data.data || response.data;
  },

  async updateInterviewStatus(
    interviewId: string,
    status: string,
    notes?: string
  ): Promise<{ interviewId: string; status: string }> {
    const response = await hiringClient.patch(`/api/v1/interviews/${interviewId}/status`, {
      status,
      notes,
    });
    return response.data.data || response.data;
  },

  async cancelInterview(interviewId: string): Promise<void> {
    await hiringClient.delete(`/api/v1/interviews/${interviewId}`);
  },
};
