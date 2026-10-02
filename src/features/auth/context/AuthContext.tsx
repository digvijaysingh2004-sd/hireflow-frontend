import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authStorage } from '../../../lib/authStorage';
import { authApi } from '../api';
import { LoginSchemaType, RegisterSchemaType, VerifyOtpSchemaType } from '../schemas';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginSchemaType) => Promise<void>;
  register: (data: RegisterSchemaType) => Promise<void>;
  verifyOtp: (data: VerifyOtpSchemaType) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!authStorage.getAccessToken();

  // Listen for unauthorized 401 events dispatched by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      authStorage.clearSession();
    };

    window.addEventListener('hireflow:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('hireflow:unauthorized', handleUnauthorized);
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      authStorage.setSession(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        },
        response.user
      );
      setUser(response.user);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string; message?: string } } }).response?.data
              ?.detail ||
            (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to sign in. Please check your credentials.'
          : 'Failed to sign in. Network or server error.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    setError(null);
    try {
      const { confirmPassword: _, ...payload } = data;
      await authApi.register(payload);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string; message?: string } } }).response?.data
              ?.detail ||
            (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Registration failed. Please try again.'
          : 'Registration failed. Network error.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpSchemaType): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp(data);
      if (res.isEmailVerified || res.message) {
        if (user) {
          const updatedUser = { ...user, isEmailVerified: true };
          setUser(updatedUser);
          authStorage.setUser(updatedUser);
        }
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string; message?: string } } }).response?.data
              ?.detail ||
            (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'OTP verification failed. Invalid or expired code.'
          : 'OTP verification failed. Network error.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const currentRefreshToken = authStorage.getRefreshToken();
      await authApi.logout(currentRefreshToken || undefined);
    } finally {
      authStorage.clearSession();
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        verifyOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
