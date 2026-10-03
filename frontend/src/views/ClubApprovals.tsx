'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import { approvalsService, ApprovalItem } from '../services/approvals.service';
import {
  CheckSquare,
  Check,
  X,
  Plus,
  Loader2,
  Clock,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const ClubApprovals: React.FC = () => {
  const { selectedBranch } = useClub();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState('Membership Verification');
  const [title, setTitle] = useState('');
  const [requester, setRequester] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('0');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await approvalsService.getApprovals();
      if (res.success && Array.isArray(res.data)) {
        setApprovals(res.data);
      } else {
        setApprovals([]);
      }
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await approvalsService.updateStatus(id, status);
      await fetchApprovals();
    } catch (err) {
      console.error('Failed to update approval:', err);
    }
  };

  const handleCreateApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requester.trim()) {
      setError('Title and requester are required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await approvalsService.createApproval({
        type,
        title: title.trim(),
        requester: requester.trim(),
        details: details.trim(),
        amount: Number(amount) || 0,
      });
      if (res.success) {
        setIsModalOpen(false);
        setTitle('');
        setRequester('');
        setDetails('');
        await fetchApprovals();
      } else {
        setError(res.message || 'Failed to submit approval');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Approvals &amp; Authorization Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Club owner sign-offs, financial refunds, and slot exceptions for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {pendingCount} Pending
          </span>
          <button
            onClick={() => {
              setError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading authorization requests...</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • Requester: {item.requester}
                    </span>
                  </div>
                  {item.details && <p className="text-xs text-slate-600">{item.details}</p>}
                  {Number(item.amount) > 0 && (
                    <p className="text-xs font-bold text-emerald-600">
                      Value: ₹ {Number(item.amount).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center gap-1.5 transition-colors border border-rose-200"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'approved')}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        item.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {approvals.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 text-sm">No Pending Approvals</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  The authorization queue is completely up to date.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Submit Approval Request</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateApproval} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Request Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option>Membership Verification</option>
                  <option>Refund Authorization</option>
                  <option>Slot Cancellation Override</option>
                  <option>VIP Guest Pass</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Request Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Refund for rained out tennis match"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Applicant / Member Name</label>
                <input
                  required
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  placeholder="e.g. Dr. Sameer Desai"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Financial Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Details &amp; Reason</label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
