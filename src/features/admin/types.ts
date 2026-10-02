import { UserRole } from '../auth/types';

export interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAtUtc: string;
}

export interface AdminUserFilterParams {
  search?: string;
  role?: UserRole;
  status?: 'Active' | 'Inactive';
  page?: number;
  pageSize?: number;
}

export interface RoleItem {
  id: string;
  name: UserRole;
  description: string;
}
