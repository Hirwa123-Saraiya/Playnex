'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  CalendarCheck,
  Ticket,
  RotateCcw,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { ApprovalItem } from '../../types/club.types';

const approvalIcons: Record<string, React.ReactNode> = {
  membership: <UserCheck className="w-4 h-4 text-rose-600" />,
  facility: <CalendarCheck className="w-4 h-4 text-purple-600" />,
  event: <Ticket className="w-4 h-4 text-indigo-600" />,
  refund: <RotateCcw className="w-4 h-4 text-rose-600" />,
};

const approvalBg: Record<string, string> = {
  membership: 'bg-rose-50',
  facility: 'bg-purple-50',
  event: 'bg-indigo-50',
  refund: 'bg-rose-50',
};

export const ClubApprovalWidget: React.FC = () => {
  const { approvals, setActiveNav, handleApprove, handleReject } = useClub();
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[400px] h-full overflow-hidden min-w-0 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Pending Approvals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Owner authorization required
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Approvals')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Approval Categories List */}
      <div className="divide-y divide-slate-100 py-1 flex-1 flex flex-col justify-around min-w-0">
        {approvals.map((app) => {
          const icon = approvalIcons[app.type] || <Check className="w-4 h-4 text-slate-600" />;
          const bg = approvalBg[app.type] || 'bg-slate-100';

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApproval(app)}
              className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition-colors cursor-pointer min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {app.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {app.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    app.count > 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {app.count}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">WhatsApp OTP verification enabled</span>
        <button
          onClick={() => setActiveNav('Approvals')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Review Queue →
        </button>
      </div>

      {/* Interactive Quick Approval Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {selectedApproval.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {selectedApproval.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedApproval.items.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  All requests in this category have been resolved!
                </p>
              ) : (
                selectedApproval.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.applicantName}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.details}</p>
                        {item.amount && (
                          <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                            {item.amount}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {item.requestedTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          handleReject(selectedApproval.id, item.id);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => {
                          handleApprove(selectedApproval.id, item.id);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
