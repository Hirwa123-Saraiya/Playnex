'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  MessageSquare,
  Send,
  Mail,
  Smartphone,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react';

export const ClubCommunications: React.FC = () => {
  const { selectedBranch } = useClub();

  const broadcasts = [
    {
      id: 'BC-101',
      title: 'Diwali Gala Dinner - RSVP Reminder',
      channel: 'WhatsApp & Email',
      audience: 'All Gold & Silver Members (1,020 members)',
      sentAt: '14 Oct 2025, 09:00 AM',
      deliveryRate: '98.4%',
      status: 'Delivered',
    },
    {
      id: 'BC-102',
      title: 'Court 3 Rain Resurfacing Maintenance Notice',
      channel: 'SMS & In-App',
      audience: 'Tennis Players with bookings this week (86 members)',
      sentAt: '13 Oct 2025, 04:30 PM',
      deliveryRate: '100%',
      status: 'Delivered',
    },
    {
      id: 'BC-103',
      title: 'Automated 15-Day Renewal Alert',
      channel: 'WhatsApp Bot',
      audience: '67 Members due for renewal in next 30 days',
      sentAt: 'Daily automated trigger at 10:00 AM',
      deliveryRate: '96.2%',
      status: 'Automated Active',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Communications & Member Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Omni-channel messaging (WhatsApp, SMS, Email, In-App) for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Send className="w-4 h-4" />
          Compose Broadcast
        </button>
      </div>

      {/* Broadcast History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Broadcast Campaigns</h3>
          <span className="text-xs text-slate-400">Integrated with Meta WhatsApp Business API</span>
        </div>
        <div className="divide-y divide-slate-100">
          {broadcasts.map((b) => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{b.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {b.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Target: {b.audience}</p>
                <p className="text-[11px] text-slate-400">Timestamp: {b.sentAt}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">{b.deliveryRate}</p>
                  <p className="text-[10px] text-slate-400">Delivered & Read</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
