'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Search, Phone, Mail, BadgeCheck, Loader2, RefreshCw } from 'lucide-react';
import { frontDeskService, type FrontDeskMember } from '@/services/frontDesk.service';

export default function FrontDeskMembersView() {
  const [members, setMembers] = useState<FrontDeskMember[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setMembers([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const data = await frontDeskService.searchMembers(q.trim());
      setMembers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Member Directory</h2>
        <p className="text-xs text-slate-500">Search members by name, email, phone, or ID</p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type to search members…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 shadow-sm"
        />
        {loading && <Loader2 size={15} className="absolute right-3.5 top-3.5 text-emerald-500 animate-spin" />}
      </div>

      {/* Results */}
      {!searched ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-3">
          <Users size={48} className="opacity-30" />
          <p className="text-sm font-semibold text-slate-400">Start typing to search members</p>
        </div>
      ) : loading ? null : members.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-2">
          <Users size={40} className="opacity-30" />
          <p className="text-sm font-semibold text-slate-400">No members found for "{query}"</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {m.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm truncate">{m.name}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <BadgeCheck size={10} /> {m.tier || m.membership || 'Member'}
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-2"><Mail size={12} className="text-slate-400" /><span className="truncate">{m.email}</span></p>
                {m.phone && <p className="flex items-center gap-2"><Phone size={12} className="text-slate-400" />{m.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
