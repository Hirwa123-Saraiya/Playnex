'use client';

import React, { useState } from 'react';
import { UserLayout } from '../layouts/UserLayout';
import { ClubLayout } from '../layouts/ClubLayout';
import { BarKitchenLayout } from '../layouts/BarKitchenLayout';
import { UtensilsCrossed, Building2, User, Sparkles } from 'lucide-react';

export default function Home() {
  const [activePortal, setActivePortal] = useState<'bar-kitchen' | 'club' | 'user'>('bar-kitchen');

  return (
    <div className="relative min-h-screen">
      {/* Quick Portal Switcher Banner */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActivePortal('bar-kitchen')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activePortal === 'bar-kitchen'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Bar & Kitchen POS</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortal('club')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePortal === 'club'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Club Owner</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortal('user')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePortal === 'user'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Member App</span>
        </button>
      </div>

      {/* Render selected portal */}
      {activePortal === 'bar-kitchen' && <BarKitchenLayout />}
      {activePortal === 'club' && <ClubLayout />}
      {activePortal === 'user' && <UserLayout />}
    </div>
  );
}
