import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from './authStorage';

const IDENTITY_BASE_URL = import.meta.env.VITE_IDENTITY_API_BASE_URL || 'http://localhost:5001';
const HIRING_BASE_URL = import.meta.env.VITE_HIRING_API_BASE_URL || 'http://localhost:5002';

export function generateCorrelationId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'req-' + Math.random().toString(36).substring(2, 11);
}

export const identityClient = axios.create({
  baseURL: IDENTITY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const hiringClient = axios.create({
  baseURL: HIRING_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Flag to track whether token refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: attach Correlation ID & Bearer Token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers['X-Correlation-ID'] = generateCorrelationId();
  const token = authStorage.getAccessToken();
  if (token && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

[identityClient, hiringClient].forEach((client) => {
  client.interceptors.request.use(requestInterceptor);
});

// Response interceptor for automatic Refresh Token Rotation on 401
const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    !originalRequest.url?.includes('/auth/refresh')
  ) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      authStorage.clearSession();
      isRefreshing = false;
      window.dispatchEvent(new CustomEvent('hireflow:unauthorized'));
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${IDENTITY_BASE_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      authStorage.setAccessToken(accessToken);
      if (newRefreshToken) {
        authStorage.setRefreshToken(newRefreshToken);
      }

      isRefreshing = false;
      processQueue(null, accessToken);

      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return axios(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      isRefreshing = false;
      authStorage.clearSession();
      window.dispatchEvent(new CustomEvent('hireflow:unauthorized'));
      return Promise.reject(refreshErr);
    }
  }

  return Promise.reject(error);
};

[identityClient, hiringClient].forEach((client) => {
  client.interceptors.response.use((res) => res, responseErrorInterceptor);
});
