'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import PWAInstallButton from '@/components/layout/PWAInstallButton';
import { useAuth } from '@/context/AuthContext';
import { ClubLayout } from '../layouts/ClubLayout';

export default function Home() {
  const { user, isLoading } = useAuth();

  // If club owner or staff is logged in, show the Club Management Portal
  if (!isLoading && user && (user.systemRole === 'CLUB_OWNER' || user.systemRole === 'STAFF')) {
    return <ClubLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center space-y-6 relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span>✨ Digital Backbone for Sports Clubs</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            The Champions Club
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Playnex Sports Club Management Platform — seamlessly managing court bookings, gear shop, memberships, and cafeteria.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/users"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 w-full sm:w-auto"
            >
              <User className="w-4 h-4" />
              <span>User / Member Portal</span>
            </Link>

            <Link
              href="/memberships"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <span>Explore Memberships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto"
            >
              <span>Club Admin Login</span>
            </Link>

            <PWAInstallButton />
          </div>

          {user && (
            <div className="pt-4">
              <span className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{user.name}</strong> ({user.systemRole})
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
