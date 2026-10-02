import axios from 'axios';

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

[identityClient, hiringClient].forEach((client) => {
  client.interceptors.request.use((config) => {
    config.headers['X-Correlation-ID'] = generateCorrelationId();
    return config;
  });
});
