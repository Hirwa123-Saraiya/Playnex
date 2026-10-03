import React from 'react';
import { X, Bell, CheckCheck, Clock, ShieldCheck, Trophy, CreditCard } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserNotificationPanel: React.FC = () => {
  const {
    isNotificationPanelOpen,
    toggleNotificationPanel,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveView,
  } = useUserStore();

  if (!isNotificationPanelOpen) return null;

  const getNotificationIcon = (type: string) => {
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={toggleNotificationPanel}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.linkView) {
                    setActiveView(notif.linkView as any);
                    toggleNotificationPanel();
                  }
                }}
                className={`pt-3 first:pt-0 cursor-pointer group transition-colors p-2 rounded-xl ${
                  notif.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={() => {
              setActiveView('notifications');
              toggleNotificationPanel();
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
