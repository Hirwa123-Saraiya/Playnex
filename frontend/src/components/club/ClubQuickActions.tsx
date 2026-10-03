'use client';

import React from 'react';
import {
  Building2,
  CalendarPlus,
  UserPlus,
  Users,
  Tag,
  BarChart3,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';

export const ClubQuickActions: React.FC = () => {
  const { setActiveModal, setActiveNav } = useClub();

  const actions = [
    {
      id: 'qa_facility',
      title: 'Add Facility',
      icon: Building2,
      bgColor: 'bg-blue-50/80 hover:bg-blue-100 text-blue-700 border-blue-200/80',
      iconColor: 'text-blue-600',
      actionKey: 'add-facility',
    },
    {
      id: 'qa_event',
      title: 'Create Event',
      icon: CalendarPlus,
      bgColor: 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80',
      iconColor: 'text-emerald-600',
      actionKey: 'create-event',
    },
    {
      id: 'qa_member',
      title: 'Add Member',
      icon: UserPlus,
      bgColor: 'bg-purple-50/80 hover:bg-purple-100 text-purple-700 border-purple-200/80',
      iconColor: 'text-purple-600',
      actionKey: 'add-member',
    },
    {
      id: 'qa_staff',
      title: 'Manage Staff',
      icon: Users,
      bgColor: 'bg-amber-50/80 hover:bg-amber-100 text-amber-700 border-amber-200/80',
      iconColor: 'text-amber-600',
      actionKey: 'manage-staff',
    },
    {
      id: 'qa_offer',
      title: 'Create Offer',
      icon: Tag,
      bgColor: 'bg-rose-50/80 hover:bg-rose-100 text-rose-700 border-rose-200/80',
      iconColor: 'text-rose-600',
      actionKey: 'create-offer',
    },
    {
      id: 'qa_reports',
      title: 'View Reports',
      icon: BarChart3,
      bgColor: 'bg-sky-50/80 hover:bg-sky-100 text-sky-700 border-sky-200/80',
      iconColor: 'text-sky-600',
      actionKey: 'view-reports',
    },
  ];

  const handleActionClick = (actionKey: string) => {
    if (actionKey === 'manage-staff') {
      setActiveNav('Staff Management');
    } else if (actionKey === 'view-reports') {
      setActiveNav('Reports & Analytics');
    } else {
      setActiveModal(actionKey);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[400px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 min-w-0">
        <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
          Quick Actions
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          Frequent club owner administrative tasks
        </p>
      </div>

      {/* Action Buttons Grid (2 columns) */}
      <div className="grid grid-cols-2 gap-2.5 py-2 flex-1 items-center min-w-0">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => handleActionClick(act.actionKey)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-150 hover:shadow-xs group cursor-pointer h-full min-h-[64px] min-w-0 ${act.bgColor}`}
            >
              <Icon
                className={`w-5 h-5 ${act.iconColor} group-hover:scale-110 transition-transform flex-shrink-0`}
              />
              <span className="text-xs font-bold leading-tight text-center break-words truncate max-w-full">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">Role permissions apply</span>
        <button
          onClick={() => setActiveNav('Settings')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Configure →
        </button>
      </div>
    </div>
  );
};
