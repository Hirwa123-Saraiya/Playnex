'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ClubLayout } from '../layouts/ClubLayout';
import { UserLayout } from '../layouts/UserLayout';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.systemRole === 'SUPER_ADMIN') {
      router.push('/super-admin/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading session...
      </main>
    );
  }

  if (user?.systemRole === 'SUPER_ADMIN') {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Redirecting to dashboard...
      </main>
    );
  }

  // With club login (CLUB_OWNER, STAFF), the club dashboard opens
  if (user?.systemRole === 'CLUB_OWNER' || user?.systemRole === 'STAFF') {
    return <ClubLayout />;
  }

  // Customer / Member Portal
  return <UserLayout />;
}
