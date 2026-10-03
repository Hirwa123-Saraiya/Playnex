import React, { useEffect, useState } from 'react';
import { apiClient } from './services/api.client';
import { Activity, ShieldCheck, Dumbbell, Calendar, ShoppingBag, Coffee, Sparkles } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState<{ status?: string; service?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/health')
      .then((res) => {
        if (res.success) {
          setHealth(res.data);
        }
      })
      .catch((err) => {
        console.error('API connection check:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/odoo_logo.svg" alt="Odoo" className="h-7 w-auto" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            The Champions Club
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            Hackathon MVP
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className={`inline-block w-2 h-2 rounded-full ${health ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{loading ? 'Checking Backend...' : health ? 'Backend Connected' : 'Offline / Mock Mode'}</span>
          </div>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Backbone for Tennis, Padel & Cricket</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Sports Club Management System
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Replacing fragmented WhatsApp chats, Excel rosters, and paper receipts with one unified operational platform.
          </p>
        </div>

        {/* Core Modules Blueprint Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Tiered Memberships</h3>
            <p className="text-xs text-slate-400 mt-1">Gold, Silver & Junior plans with automated discounts and expiry tracking.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Court Scheduling</h3>
            <p className="text-xs text-slate-400 mt-1">Tennis & cricket turf bookings with conflict prevention & Friday social play.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Omnichannel Shop</h3>
            <p className="text-xs text-slate-400 mt-1">Rackets, balls & shoes with unified inventory for counter and home delivery.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Bar & Cafeteria POS</h3>
            <p className="text-xs text-slate-400 mt-1">Open table tabs, auto member discounts, split bills (Cash/Card/UPI).</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-500">
        <span>The Champions Club • Ready for Feature Implementation</span>
      </footer>
    </div>
  );
}
