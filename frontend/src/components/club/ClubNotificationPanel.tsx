'use client';

import React from 'react';
import {
  AlertCircle,
  Wrench,
  Info,
  RotateCcw,
  ChevronRight,
  BellRing,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { NotificationAlertItem } from '../../types/club.types';

const notifIconMap: Record<string, React.ReactNode> = {
  expiry: <AlertCircle className="w-4 h-4 text-rose-600" />,
  maintenance: <Wrench className="w-4 h-4 text-amber-600" />,
  event: <Info className="w-4 h-4 text-blue-600" />,
  refund: <RotateCcw className="w-4 h-4 text-purple-600" />,
};

const notifBgMap: Record<string, string> = {
  expiry: 'bg-rose-50',
  maintenance: 'bg-amber-50',
  event: 'bg-blue-50',
  refund: 'bg-purple-50',
};

export const ClubNotificationPanel: React.FC = () => {
  const { notifications, markNotificationRead, setActiveNav } = useClub();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Notifications & Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Operational warnings & priority notices
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Communications')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 py-2 flex-1 overflow-y-auto max-h-[300px] pr-1 min-w-0">
        {notifications.map((item: NotificationAlertItem) => {
          const icon = notifIconMap[item.type] || <BellRing className="w-4 h-4 text-slate-600" />;
          const bg = notifBgMap[item.type] || 'bg-slate-100';

          return (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 min-w-0 ${
                item.unread
                  ? 'bg-slate-50/80 border-slate-200/90 hover:bg-slate-100/70'
                  : 'bg-white border-slate-100 hover:bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  {icon}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </p>
                    {item.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-blue-100 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug break-words line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap pt-0.5 flex-shrink-0">
                {item.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">Automated push alerts active</span>
        <button
          onClick={() => setActiveNav('Communications')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Alert Settings →
        </button>
      </div>
    </div>
  );
};
