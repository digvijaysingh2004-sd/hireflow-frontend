import { UserRole } from '../auth/types';

export interface AdminUserItem {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles: UserRole[];
  isActive: boolean;
  isEmailVerified?: boolean;
  createdAtUtc?: string;
  createdAt?: string;
  [key: string]: unknown;
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
