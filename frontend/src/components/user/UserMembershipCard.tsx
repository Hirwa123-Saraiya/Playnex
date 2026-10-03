import React, { useState } from 'react';
import { ShieldCheck, QrCode, Download, Share2, Sparkles, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { UserMembership } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserMembershipCardProps {
  membership: UserMembership;
  onRenew?: () => void;
}

export const UserMembershipCard: React.FC<UserMembershipCardProps> = ({ membership, onRenew }) => {
  const { currentUser } = useUserStore();
  const [showQR, setShowQR] = useState(false);

  const getTierTheme = () => {
    switch (membership.tier) {
      case 'Platinum':
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-700',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
          glow: 'shadow-indigo-500/10',
        };
      case 'Gold':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white border-amber-600/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          glow: 'shadow-amber-500/10',
        };
      case 'Family':
        return {
          bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 text-white border-cyan-600/30',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
          glow: 'shadow-cyan-500/10',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700',
          badge: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
          glow: 'shadow-slate-500/10',
        };
    }
  };

  const theme = getTierTheme();

  return (
    <div className="flex flex-col space-y-3">
      {/* Visual Digital Luxury Card */}
      <div
        className={`relative rounded-3xl p-6 sm:p-7 border ${theme.bg} shadow-2xl ${theme.glow} overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
      >
        {/* Subtle holographic watermark pattern */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-6 top-6 opacity-10 font-black text-6xl tracking-tighter select-none pointer-events-none">
          PLAYNEX
        </div>

        {/* Top Header of Card */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge} uppercase tracking-wider`}>
                {membership.tier} Tier
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                {membership.status}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
              {membership.clubName}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {membership.planName}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Middle: Member info & Membership Number */}
        <div className="mt-8 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
              Member Name
            </span>
            <span className="text-base font-bold text-white tracking-wide">
              {currentUser.name}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-300 tracking-wider">
                {membership.membershipNumber}
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
              Valid Thru
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {membership.endDate}
            </span>
          </div>
        </div>

        {/* Linked Family Members Indicator if any */}
        {membership.linkedFamilyMembers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Included Family:</span>
            <span className="font-semibold text-white">
              {membership.linkedFamilyMembers.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Action Bar Under Card */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>{showQR ? 'Hide QR Code' : 'Turnstile QR Pass'}</span>
          </button>
          <button
            onClick={() => alert(`Digital membership card ${membership.membershipNumber} downloaded.`)}
            className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Card</span>
          </button>
        </div>

        {onRenew && (
          <button
            onClick={onRenew}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-sm transition-colors"
          >
            <span>Renew / Upgrade</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* QR Code Reveal Panel */}
      {showQR && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-2 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-bold text-slate-800">Scan at Club Turnstile Gate</p>
          <div className="w-36 h-36 mx-auto bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
            <img src={membership.qrCode} alt="Member QR Code" className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {membership.membershipNumber} • Instant Gate Authentication
          </p>
        </div>
      )}
    </div>
  );
};
