import { identityClient } from '../../lib/apiClient';
import {
  LoginSchemaType,
  RegisterSchemaType,
  VerifyOtpSchemaType,
  ResetPasswordSchemaType,
} from './schemas';
import { LoginResponse, User } from './types';

export const authApi = {
  async login(data: LoginSchemaType): Promise<LoginResponse> {
    const response = await identityClient.post<LoginResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  async register(data: Omit<RegisterSchemaType, 'confirmPassword'>): Promise<{ message: string; user?: User }> {
    const response = await identityClient.post<{ message: string; user?: User }>('/api/v1/auth/register', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpSchemaType): Promise<{ message: string; success: boolean }> {
    const response = await identityClient.post<{ message: string; success: boolean }>('/api/v1/auth/verify-email', data);
    return response.data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const response = await identityClient.post<{ message: string }>('/api/v1/auth/resend-otp', { email });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await identityClient.post<{ message: string }>('/api/v1/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: Omit<ResetPasswordSchemaType, 'confirmPassword'>): Promise<{ message: string }> {
    const response = await identityClient.post<{ message: string }>('/api/v1/auth/reset-password', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await identityClient.post('/api/v1/auth/logout');
    } catch {
      // Ignore logout API failure and clear local session anyway
    }
  },
};
