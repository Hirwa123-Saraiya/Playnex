'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '../types/auth.types';
import { authService, RegisterPayload } from '../services/auth.service';

//trail
import { trialIsActive, trialDaysRemaining, trialUrgency } from "../lib/trialRules";


interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (payload: RegisterPayload) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: boolean;
  isClubOwner: boolean;
  isStaff: boolean;
  isMember: boolean;

  /* ---- derived trial state ---- */
  trialActive: boolean;
  trialDaysLeft: number;
  trialUrgency: "fresh" | "warning" | "critical" | "expired" | "paid";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session via HTTP-only cookie or localStorage token on initial mount
  useEffect(() => {
    authService
      .getMe()
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      })
      .catch(async () => {
        const storedRefreshToken =
          typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!storedRefreshToken) {
          setUser(null);
          return;
        }

        // Try refreshing token via stored refreshToken
        try {
          const refreshRes = await authService.refresh(storedRefreshToken);
          if (refreshRes.success && refreshRes.data?.user) {
            if (typeof window !== 'undefined') {
              if (refreshRes.data.accessToken) {
                localStorage.setItem('accessToken', refreshRes.data.accessToken);
              }
              if (refreshRes.data.refreshToken) {
                localStorage.setItem('refreshToken', refreshRes.data.refreshToken);
              }
            }
            setUser(refreshRes.data.user);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
          }
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
        }
        setUser(res.data.user);
        return res.data.user;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<AuthUser | null> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
          }
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
        }
        setUser(res.data.user);
        return res.data.user;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.systemRole === 'SUPER_ADMIN' || user.systemRole === 'CLUB_OWNER') {
      return true;
    }
    return user.permissions?.includes(permission) ?? false;
  };

  const value: AuthContextType = {
    user,
    isLoading,

     /* ---- derived trial state ---- */
    trialActive:     trialIsActive(user),
    trialDaysLeft:   trialDaysRemaining(user),
    trialUrgency:    trialUrgency(user),

    login,
    register,
    logout,
    hasPermission,
    isSuperAdmin: user?.systemRole === 'SUPER_ADMIN',
    isClubOwner: user?.systemRole === 'CLUB_OWNER',
    isStaff: user?.systemRole === 'STAFF',
    isMember: user?.systemRole === 'MEMBER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
