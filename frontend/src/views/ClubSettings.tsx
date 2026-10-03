'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  Settings,
  Building2,
  Save,
  ShieldCheck,
  CreditCard,
  Bell,
  Globe,
} from 'lucide-react';

export const ClubSettings: React.FC = () => {
  const { club, selectedBranch } = useClub();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Club Settings & Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure multi-tenant parameters, GST profiles, payment gateways and automated alerts for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {/* Multi-Tenant Metadata */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Multi-Tenant Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Tenant ID</label>
              <input
                type="text"
                disabled
                value={club.tenantId}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Club ID</label>
              <input
                type="text"
                disabled
                value={club.id}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Active Branch ID</label>
              <input
                type="text"
                disabled
                value={selectedBranch.id}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Club Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Club Profile & Branch Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Club Name</label>
              <input
                type="text"
                defaultValue={club.name}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Branch Operating Title</label>
              <input
                type="text"
                defaultValue={selectedBranch.name}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Branch Address</label>
              <input
                type="text"
                defaultValue={selectedBranch.address}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">GSTIN Number</label>
              <input
                type="text"
                defaultValue="24AAACP1234F1Z8"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                defaultValue={selectedBranch.phone}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600" />
            Integrations & Hardware Connected
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <p className="font-bold text-emerald-800">Razorpay POS & Web</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Connected (Live Mode)</p>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <p className="font-bold text-emerald-800">Meta WhatsApp Cloud API</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Active (Template Verified)</p>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <p className="font-bold text-emerald-800">RFID Turnstiles & Gates</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">8 Readers Synced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
