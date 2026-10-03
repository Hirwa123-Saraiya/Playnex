'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Building2, Shield, Crown } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, logout, isLoading, isSuperAdmin, isClubOwner, isStaff, isMember } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading session...
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            {isSuperAdmin && <Crown className="w-6 h-6" />}
            {isClubOwner && <Building2 className="w-6 h-6" />}
            {isStaff && <Shield className="w-6 h-6" />}
            {isMember && <User className="w-6 h-6" />}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">{user.name}</h1>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Club Tenant:</span>
            <span className="font-semibold text-slate-200">{user.tenantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Role:</span>
            <span className="font-semibold text-amber-400">{user.roleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">System Role:</span>
            <span className="font-mono text-slate-300">{user.systemRole}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </main>
  );
}
