import { describe, it, expect, beforeEach } from 'vitest';
import { authStorage } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    authStorage.clearSession();
  });

  it('stores and retrieves access and refresh tokens', () => {
    authStorage.setAccessToken('access-token-123');
    authStorage.setRefreshToken('refresh-token-456');

    expect(authStorage.getAccessToken()).toBe('access-token-123');
    expect(authStorage.getRefreshToken()).toBe('refresh-token-456');
  });

  it('clears stored session on clearSession call', () => {
    authStorage.setAccessToken('access-token-123');
    authStorage.setRefreshToken('refresh-token-456');
    authStorage.clearSession();

    expect(authStorage.getAccessToken()).toBeNull();
    expect(authStorage.getRefreshToken()).toBeNull();
    expect(authStorage.getUser()).toBeNull();
  });

  it('stores and retrieves user payload', () => {
    const mockUser = {
      id: 'usr-1',
      email: 'recruiter@hireflow.io',
      roles: ['Recruiter' as const],
      isEmailVerified: true,
    };

    authStorage.setUser(mockUser);
    expect(authStorage.getUser()).toEqual(mockUser);
  });
});
