import { apiMethod } from './api';
import { AuthUser } from '../types/auth.types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  type?: 'CLUB_OWNER' | 'MEMBER';
  clubName?: string;
  tier?: 'Gold' | 'Silver' | 'Junior';
}

export interface AuthSessionResponse {
  user: AuthUser;
}

export const authService = {
  /**
   * Login using apiMethod
   */
  async login(email: string, password: string) {
    return apiMethod<AuthSessionResponse>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
  },

  /**
   * Register using apiMethod
   */
  async register(payload: RegisterPayload) {
    return apiMethod<AuthSessionResponse>({
      method: 'POST',
      url: '/auth/register',
      data: payload,
    });
  },

  /**
   * Fetch current authenticated profile using apiMethod
   */
  async getMe() {
    return apiMethod<AuthUser>({
      method: 'GET',
      url: '/auth/me',
    });
  },

  /**
   * Refresh token using apiMethod
   */
  async refresh() {
    return apiMethod<AuthSessionResponse>({
      method: 'POST',
      url: '/auth/refresh',
    });
  },

  /**
   * Logout using apiMethod
   */
  async logout() {
    return apiMethod({
      method: 'POST',
      url: '/auth/logout',
    });
  },
};

export default authService;
