import { identityClient } from '../../../lib/apiClient';
import { ApiEnvelope, UserRole } from '../../auth/types';
import { AdminUserItem, AdminUserFilterParams, RoleItem } from '../types';

export const adminApi = {
  async getUsers(params?: AdminUserFilterParams): Promise<ApiEnvelope<AdminUserItem[]>> {
    const response = await identityClient.get('/api/v1/users', { params });
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

  async getUserById(userId: string): Promise<AdminUserItem> {
    const response = await identityClient.get(`/api/v1/users/${userId}`);
    return response.data.data || response.data;
  },

  async updateUserStatus(
    userId: string,
    isActive: boolean,
    reason?: string
  ): Promise<{ userId: string; isActive: boolean }> {
    const response = await identityClient.patch(`/api/v1/users/${userId}/status`, {
      isActive,
      reason,
    });
    return response.data.data || response.data;
  },

  async updateUserRoles(
    userId: string,
    roles: UserRole[]
  ): Promise<{ userId: string; roles: UserRole[] }> {
    const response = await identityClient.put(`/api/v1/users/${userId}/roles`, { roles });
    return response.data.data || response.data;
  },

  async getRoles(): Promise<RoleItem[]> {
    const response = await identityClient.get('/api/v1/roles');
    return response.data.data || response.data;
  },
};
