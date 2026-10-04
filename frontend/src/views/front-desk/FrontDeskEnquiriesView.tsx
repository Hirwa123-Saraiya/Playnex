'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Loader2, RefreshCw, Phone, Mail, User, Clock3, CheckCircle2, XCircle } from 'lucide-react';
import { apiMethod } from '@/services/api';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
  source?: string;
}

const STATUS_COLOR: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-emerald-100 text-emerald-700',
  closed:    'bg-slate-100 text-slate-500',
};

export default function FrontDeskEnquiriesView() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiMethod<Enquiry[]>({ method: 'GET', url: '/club/enquiries' });
      if (res.success && Array.isArray(res.data)) {
        setEnquiries(res.data);
      }
    } catch {
      // API may not be available — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);
  const newCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Enquiries & Leads</h2>
          <p className="text-xs text-slate-500">Manage walk-in enquiries and prospective members</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: enquiries.length,                                    color: 'text-slate-800',   bg: 'bg-white border-slate-200' },
          { label: 'New',       value: newCount,                                             color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
          { label: 'Contacted', value: enquiries.filter(e => e.status === 'contacted').length, color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
          { label: 'Converted', value: enquiries.filter(e => e.status === 'converted').length, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg} shadow-sm`}>
            <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {(['all', 'new', 'contacted', 'converted'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 gap-2">
          <MessageSquare size={36} className="opacity-30" />
          <p className="text-sm">No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(e => (
            <div key={e.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {e.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{e.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail size={11} />{e.email}</span>
                      <span className="flex items-center gap-1"><Phone size={11} />{e.phone}</span>
                      <span className="flex items-center gap-1"><Clock3 size={11} />{new Date(e.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                    </div>
                    {e.message && <p className="mt-2 text-xs text-slate-600 italic line-clamp-2">"{e.message}"</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_COLOR[e.status]}`}>
                    {e.status.toUpperCase()}
                  </span>
                  {e.status === 'new' && (
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold transition">
                      <CheckCircle2 size={11} /> Mark Contacted
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
