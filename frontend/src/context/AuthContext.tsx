'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '../types/auth.types';
import { authService, RegisterPayload } from '../services/auth.service';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session via HTTP-only cookie on initial mount
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
        // Try refreshing token via refreshToken cookie before giving up
        try {
          const refreshRes = await authService.refresh();
          if (refreshRes.success && refreshRes.data?.user) {
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
