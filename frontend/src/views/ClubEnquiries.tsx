'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  AlertCircle,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  PhoneCall,
  Calendar,
  Send,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { EnquiryStatusBadge } from '@/components/enquiries/EnquiryStatusBadge';
import { fetchEnquiries, updateEnquiry, convertToMember } from '@/services/enquiryService';
import { computeStats, isFollowUpOverdue, SOURCE_LABEL } from '@/lib/enquiryRules';
import type { Enquiry, EnquiryStatus } from '@/types/enquiry.types';

const TABS: Array<'All' | EnquiryStatus> = [
  'All',
  'New',
  'Assigned',
  'Contacted',
  'Quoted',
  'Converted',
  'Lost',
];

export const ClubEnquiries: React.FC = () => {
  const [list, setList] = useState<Enquiry[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [query, setQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    const data = await fetchEnquiries();
    setList(data);
    if (selectedEnquiry) {
      const refreshed = data.find((e) => e.id === selectedEnquiry.id);
      if (refreshed) setSelectedEnquiry(refreshed);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((e) => {
      if (tab !== 'All' && e.status !== tab) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        (e.sportInterest && e.sportInterest.toLowerCase().includes(q))
      );
    });
  }, [list, tab, query]);

  const stats = useMemo(() => computeStats(list), [list]);

  const handleStatusChange = async (enquiryId: string, status: EnquiryStatus) => {
    setActionLoading(true);
    try {
      await updateEnquiry(enquiryId, { status });
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !noteText.trim()) return;
    setActionLoading(true);
    try {
      await updateEnquiry(selectedEnquiry.id, { noteText });
      setNoteText('');
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvert = async (enquiryId: string) => {
    setActionLoading(true);
    try {
      await convertToMember(enquiryId);
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
            Leads & Enquiry CRM Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Capture, follow-up, quote, and convert online visitors and trial requests into paid club members.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-[#D9E6F5] text-xs font-semibold rounded-xl text-[#0B1F4D] transition-colors self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#1565D8]" />
          Refresh Pipeline
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EAF3FF] text-[#1565D8]">
              <Users size={14} />
            </span>
            Total Leads
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#0B1F4D]">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle size={14} />
            </span>
            New / Uncontacted
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">{stats.new}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-[#1565D8]">
              <TrendingUp size={14} />
            </span>
            In Follow-Up
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#0B1F4D]">{stats.inProgress}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={14} />
            </span>
            Converted Members
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">
            {stats.converted}{' '}
            <span className="text-xs font-normal text-[#64748B]">({stats.conversionRate}%)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t
                  ? 'bg-[#1565D8] text-white shadow-sm'
                  : 'bg-slate-50 text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, sports, phone..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#D9E6F5] text-xs outline-none focus:border-[#1565D8] bg-[#F7FAFC]"
          />
        </div>
      </div>

      {/* Enquiries Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className={`space-y-3 ${selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-[#D9E6F5] p-10 text-center text-sm text-[#64748B]">
              No enquiries match your search criteria.
            </div>
          ) : (
            filtered.map((e) => {
              const overdue = isFollowUpOverdue(e);
              const isSelected = selectedEnquiry?.id === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => setSelectedEnquiry(e)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-[#1565D8] ring-2 ring-[#1565D8]/20 shadow-md'
                      : 'border-[#D9E6F5] hover:border-[#1565D8]/50 shadow-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0B1F4D]">{e.name}</span>
                      <EnquiryStatusBadge status={e.status} />
                      {overdue && (
                        <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold">
                          Follow-up Due
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      {new Date(e.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#1E293B] line-clamp-2 bg-[#F7FAFC] p-2 rounded-lg border border-[#D9E6F5]/60">
                    {e.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1565D8] font-semibold text-[11px]">
                        {SOURCE_LABEL[e.source]}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-[#1E293B]">{e.sportInterest || 'All Sports'}</span>
                      {e.planInterest && e.planInterest !== 'Undecided' && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 font-semibold">{e.planInterest} Plan</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span>Contact:</span>
                      <span className="font-semibold text-[#0B1F4D]">{e.phone || e.email}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lead Detail & Quick Follow-Up Actions Drawer */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-sm space-y-5 h-fit sticky top-20">
            <div className="flex items-start justify-between border-b border-[#D9E6F5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0B1F4D]">{selectedEnquiry.name}</h3>
                  <EnquiryStatusBadge status={selectedEnquiry.status} />
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  ID: <span className="font-mono text-[#0B1F4D]">{selectedEnquiry.id}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs text-[#64748B] hover:text-[#0B1F4D] font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Contact & Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Phone:</span>
                <span className="font-semibold text-[#0B1F4D]">{selectedEnquiry.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Email:</span>
                <span className="font-semibold text-[#0B1F4D]">{selectedEnquiry.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Preferred Channel:</span>
                <span className="font-semibold text-[#1565D8]">{selectedEnquiry.preferredContact}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Sport Interested:</span>
                <span className="font-semibold text-[#0B1F4D]">{selectedEnquiry.sportInterest || 'Multi-Sport'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Target Plan:</span>
                <span className="font-semibold text-amber-600">{selectedEnquiry.planInterest || 'Undecided'}</span>
              </div>
            </div>

            {/* Change Status Pipeline Actions */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                Move Stage
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Contacted', 'Quoted', 'Converted', 'Lost'] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    disabled={actionLoading || selectedEnquiry.status === st}
                    onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedEnquiry.status === st
                        ? 'bg-[#0B1F4D] text-white border-[#0B1F4D]'
                        : 'border-[#D9E6F5] text-[#0B1F4D] hover:bg-[#EAF3FF]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Convert to Member Action */}
            {selectedEnquiry.status !== 'Converted' && (
              <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#1565D8]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1F4D]">Convert to Official Member</h4>
                    <p className="text-[11px] text-[#64748B]">Issues member ID & activates membership</p>
                  </div>
                  <button
                    onClick={() => handleConvert(selectedEnquiry.id)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Convert Now
                  </button>
                </div>
              </div>
            )}

            {/* Staff Notes Log */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                Follow-Up History & Notes
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedEnquiry.notes.length === 0 ? (
                  <p className="text-[11px] text-[#64748B] italic">No staff notes logged yet.</p>
                ) : (
                  selectedEnquiry.notes.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
                        <span className="font-semibold text-[#0B1F4D]">{n.authorName}</span>
                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[#1E293B]">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Log call summary or quote sent..."
                  className="flex-1 h-8 px-3 rounded-lg border border-[#D9E6F5] text-xs outline-none focus:border-[#1565D8]"
                />
                <button
                  type="submit"
                  disabled={actionLoading || !noteText.trim()}
                  className="px-3 h-8 bg-[#0B1F4D] text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
