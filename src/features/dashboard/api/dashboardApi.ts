import { hiringClient } from '../../../lib/apiClient';
import { ApiEnvelope } from '../../auth/types';
import { DashboardSummary, AuditLog, AuditLogFilterParams } from '../types';

export const dashboardApi = {
  async getDashboardSummary(fromUtc?: string, toUtc?: string): Promise<DashboardSummary> {
    const response = await hiringClient.get('/api/v1/dashboard/summary', {
      params: { fromUtc, toUtc },
    });
    return response.data.data || response.data;
  },

  async getAuditLogs(params?: AuditLogFilterParams): Promise<ApiEnvelope<AuditLog[]>> {
    const response = await hiringClient.get('/api/v1/audit-logs', { params });
    if (response.data?.items && Array.isArray(response.data.items)) {
      return {
        data: response.data.items,
        pagination: {
          page: response.data.page || 1,
          pageSize: response.data.pageSize || 50,
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
        pageSize: params?.pageSize || 50,
        totalCount: Array.isArray(response.data) ? response.data.length : 0,
        totalPages: 1,
        hasNextPage: false,
      },
    };
  },

  async getAuditLogById(auditId: string): Promise<AuditLog> {
    const response = await hiringClient.get(`/api/v1/audit-logs/${auditId}`);
    return response.data.data || response.data;
  },
};
