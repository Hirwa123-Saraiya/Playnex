import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  Search,
  Bell,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceHeader: React.FC = () => {
  const {
    fiscalYear,
    setFiscalYear,
    branches,
    selectedBranch,
    setSelectedBranch,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    toastMessage,
  } = useFinanceStore();

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3 max-w-[1720px] mx-auto">
        {/* Left: Brand info & Branch / FY Switcher */}
        <div className="flex items-center gap-3">
          {/* Branch Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-slate-100 transition-all text-left shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Club Entity & Branch
                </span>
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors block">
                  {selectedBranch.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ml-1" />
            </button>

            {branchDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Operating Branch
                </div>
                <div className="space-y-1 mt-1">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-colors ${
                        selectedBranch.id === b.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{b.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financial Year Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-slate-400 text-[10px] font-semibold">FY:</span>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-extrabold text-slate-900"
            >
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
            </select>
          </div>
        </div>

        {/* Center: Live Notification Toast (if any) or Global Search Bar */}
        {toastMessage ? (
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold animate-in fade-in slide-in-from-top-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger, invoices, vouchers..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>
        )}

        {/* Right: Date Range Selector & Admin Profile matching Reference Image */}
        <div className="flex items-center gap-3">
          {/* Date Range Selector matching reference image: [Oct 2025 ▾] */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900"
            >
              <option value="Oct 2025">Oct 2025</option>
              <option value="Sep 2025">Sep 2025</option>
              <option value="Q3 2025">Q3 2025</option>
              <option value="FY to Date">FY to Date</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors relative shadow-2xs"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          </button>

          {/* Admin User Profile matching reference image: [Avatar] Admin (Club Owner) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Admin"
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-black text-slate-900 block leading-tight">
                Admin
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                Club Owner
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
