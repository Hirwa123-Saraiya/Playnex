import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, Trophy, CreditCard } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveView } =
    useUserStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter(
    (n) => filterType === 'all' || (filterType === 'unread' ? !n.isRead : n.type === filterType)
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'membership':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Trophy className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Activity Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notifications & Alerts
          </h1>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 text-xs">
        {['all', 'unread', 'booking', 'membership', 'event', 'payment'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all ${
              filterType === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              markNotificationAsRead(item.id);
              if (item.linkView) setActiveView(item.linkView as any);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.isRead ? 'bg-white border-slate-200' : 'bg-blue-50/60 border-blue-200 shadow-xs'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <span className="text-[10px] text-slate-400">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
