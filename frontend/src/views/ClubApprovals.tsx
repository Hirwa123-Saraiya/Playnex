'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  CheckSquare,
  Check,
  X,
  UserCheck,
  CalendarCheck,
  Ticket,
  RotateCcw,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ClubApprovals: React.FC = () => {
  const { selectedBranch, approvals, handleApprove, handleReject } = useClub();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Approvals & Authorization Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pending club owner sign-offs, financial refunds, and membership verifications for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {approvals.reduce((a, c) => a + c.count, 0)} Items Pending
          </span>
        </div>
      </div>

      {/* Categories & Queues */}
      <div className="space-y-6">
        {approvals.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{cat.title}</h3>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-800">
                {cat.count} Requests
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {cat.items.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No pending items in this category. All clear!
                </div>
              ) : (
                cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {item.applicantName}
                        </span>
                        <span className="text-[11px] text-slate-400">• {item.requestedTime}</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.details}</p>
                      {item.amount && (
                        <p className="text-xs font-bold text-emerald-600">
                          Value: {item.amount}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(cat.id, item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center gap-1.5 transition-colors border border-rose-200"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(cat.id, item.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
