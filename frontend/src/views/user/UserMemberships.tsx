import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Sparkles,
  Award,
  Calendar,
  Users,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserMembershipCard } from '../../components/user/UserMembershipCard';

export const UserMemberships: React.FC = () => {
  const {
    userMemberships,
    membershipPlans,
    clubs,
    startMembershipPurchase,
    renewMembership,
    setActiveView,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'Active' | 'All' | 'Offers'>('Active');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('All');

  const filteredMemberships = userMemberships.filter((m) => {
    const matchesTab = activeTab === 'All' || m.status === 'Active' || (activeTab === 'Active' && m.status === 'Renewing Soon');
    const matchesClub = selectedClubFilter === 'All' || m.clubId === selectedClubFilter;
    return matchesTab && matchesClub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Multi-Club Passport & Passes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Club Memberships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            One account connects you to all your verified country club memberships with turnstile QR entry.
          </p>
        </div>

        <button
          onClick={() => startMembershipPurchase()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buy New Membership</span>
        </button>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {(['Active', 'All', 'Offers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'Offers' ? 'Browse All Club Plans' : `${tab} Memberships`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Club:</span>
          <select
            value={selectedClubFilter}
            onChange={(e) => setSelectedClubFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Clubs</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Content: Active/All Cards */}
      {activeTab !== 'Offers' ? (
        <div className="space-y-6">
          {filteredMemberships.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active memberships found</h3>
              <p className="text-xs text-slate-500">
                Explore our partner clubs to join and enjoy exclusive multi-sports benefits.
              </p>
              <button
                onClick={() => setActiveTab('Offers')}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Browse Membership Plans
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredMemberships.map((membership) => (
                <UserMembershipCard
                  key={membership.id}
                  membership={membership}
                  onRenew={() => renewMembership(membership.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab Content: Available Club Membership Plans to Buy */
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Explore Club Passes</h3>
            <p className="text-xs text-slate-500">
              Join multiple clubs under a single billing profile. Add family members with unified turnstile passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipPlans
              .filter((plan) => selectedClubFilter === 'All' || plan.clubId === selectedClubFilter)
              .map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {plan.tier}
                      </span>
                      {plan.discountBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {plan.discountBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-blue-600 block">
                        {plan.clubName}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{plan.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{plan.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">₹{plan.priceAnnual}</span>
                        <span className="text-xs text-slate-400">/year</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Monthly: ₹{plan.priceMonthly}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {plan.includedFacilities.slice(0, 3).map((f) => (
                        <div key={f} className="truncate">• {f}</div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startMembershipPurchase(plan.clubId, plan.id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Select Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
