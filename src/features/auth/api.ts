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
    const response = await identityClient.post('/api/v1/auth/login', data);
    return response.data.data || response.data;
  },

  async register(data: Omit<RegisterSchemaType, 'confirmPassword'>): Promise<{ message?: string; userId?: string; email?: string }> {
    const response = await identityClient.post('/api/v1/auth/register', data);
    return response.data.data || response.data;
  },

  async verifyOtp(data: VerifyOtpSchemaType): Promise<{ message?: string; isEmailVerified?: boolean }> {
    const response = await identityClient.post('/api/v1/auth/verify-email', data);
    return response.data.data || response.data;
  },

  async resendOtp(email: string): Promise<{ message?: string }> {
    const response = await identityClient.post('/api/v1/auth/resend-otp', { email, purpose: 'EmailVerification' });
    return response.data.data || response.data;
  },

  async forgotPassword(email: string): Promise<{ message?: string }> {
    const response = await identityClient.post('/api/v1/auth/forgot-password', { email });
    return response.data.data || response.data;
  },

  async resetPassword(data: Omit<ResetPasswordSchemaType, 'confirmPassword'>): Promise<void> {
    await identityClient.post('/api/v1/auth/reset-password', data);
  },

  async getMe(): Promise<User> {
    const response = await identityClient.get('/api/v1/auth/me');
    return response.data.data || response.data;
  },

  async logout(refreshToken?: string): Promise<void> {
    try {
      await identityClient.post('/api/v1/auth/logout', { refreshToken });
    } catch {
      // Ignore logout API failure and clear local session anyway
    }
  },
};
