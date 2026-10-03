'use client';

import React from 'react';
import {
  Calendar,
  UserPlus,
  Utensils,
  RotateCcw,
  Users,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { ActivityTimelineItem } from '../../types/club.types';

const activityIconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-4 h-4 text-emerald-600" />,
  'user-plus': <UserPlus className="w-4 h-4 text-blue-600" />,
  utensils: <Utensils className="w-4 h-4 text-orange-600" />,
  'rotate-ccw': <RotateCcw className="w-4 h-4 text-rose-600" />,
  'users-group': <Users className="w-4 h-4 text-purple-600" />,
};

const activityBgMap: Record<string, string> = {
  emerald: 'bg-emerald-50',
  blue: 'bg-blue-50',
  amber: 'bg-orange-50',
  rose: 'bg-rose-50',
  purple: 'bg-purple-50',
};

export const ClubActivityFeed: React.FC = () => {
  const { activities, setActiveNav } = useClub();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Recent Activity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Audit log of live interactions
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Reports & Analytics')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3 py-2 flex-1 overflow-y-auto max-h-[300px] pr-1 min-w-0">
        {activities.map((act: ActivityTimelineItem) => {
          const icon = activityIconMap[act.icon] || <Activity className="w-4 h-4 text-slate-600" />;
          const bg = activityBgMap[act.color] || 'bg-slate-100';

          return (
            <div key={act.id} className="flex items-start justify-between gap-2.5 group min-w-0">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  {icon}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 break-words leading-snug">
                    <span className="font-bold text-slate-900">{act.user}</span>{' '}
                    {act.action}
                  </p>
                  {act.detail && (
                    <p className="text-[11px] text-slate-400 break-words leading-tight">
                      {act.detail}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap pt-0.5 flex-shrink-0">
                {act.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">Logged under tenant auditing</span>
        <button
          onClick={() => setActiveNav('Reports & Analytics')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Activity Archive →
        </button>
      </div>
    </div>
  );
};
