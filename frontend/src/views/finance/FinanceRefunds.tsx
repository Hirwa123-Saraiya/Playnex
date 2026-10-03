import React, { useState } from 'react';
import { RotateCcw, Plus, CheckCircle2, Clock, ArrowRight, XCircle } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';
import { FinanceRefund } from '../../types/FinanceTypes';

export const FinanceRefunds: React.FC = () => {
  const { refunds, addRefund, updateRefundStatus } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    department: 'Court Booking',
    type: 'Booking Refund',
    amount: 2500,
    reason: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.amount) return;

    const newRef: FinanceRefund = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      refundNumber: `REF-2025-${Math.floor(100 + Math.random() * 900)}`,
      type: form.type as any,
      customerName: form.customerName,
      department: form.department as any,
      amount: Number(form.amount),
      reason: form.reason,
      status: 'Requested',
      requestDate: 'Today',
    };

    addRefund(newRef);
    setShowModal(false);
  };

  const stages: FinanceRefund['status'][] = ['Requested', 'Approved', 'Processed', 'Completed'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Refunds & Dispute Resolution Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Structured 4-stage audit trail: Requested → Approved → Processed → Completed.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Initiate Refund Claim</span>
        </button>
      </div>

      {/* 4-Stage Visual Pipeline Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          Refund Governance Pipeline
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {stages.map((stage, idx) => {
            const count = refunds.filter((r) => r.status === stage).length;
            return (
              <div key={stage} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Stage {idx + 1}
                </span>
                <span className="font-black text-slate-900 text-sm block mt-0.5">{stage}</span>
                <span className="text-xs font-bold text-blue-600 mt-1 block">{count} Claims Active</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Claim No</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Advance Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {refunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{ref.refundNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{ref.type}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{ref.customerName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {ref.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{ref.reason}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-600">
                    ₹ {ref.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ref.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ref.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {ref.status === 'Requested' && (
                      <button
                        onClick={() => updateRefundStatus(ref.id, 'Approved')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Approve Claim →
                      </button>
                    )}
                    {ref.status === 'Approved' && (
                      <button
                        onClick={() => updateRefundStatus(ref.id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Process Payout ✓
                      </button>
                    )}
                    {ref.status === 'Completed' && (
                      <span className="text-emerald-700 font-bold text-[11px]">Paid to Wallet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-black text-slate-900">Initiate Customer Refund</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer / Member Name</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="e.g. Aditya Mehta"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Refund Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Booking Refund">Booking Refund</option>
                    <option value="Membership Refund">Membership Refund</option>
                    <option value="Event Refund">Event Refund</option>
                    <option value="Shop Refund">Shop Refund</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cancellation / Refund Justification</label>
                <textarea
                  rows={2}
                  required
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="e.g. Rainout cancellation on court booking..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
