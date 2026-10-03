import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Search, 
  ShieldCheck, 
  FileText,
  UserCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import { FinanceApprovalRequest } from '../../types/FinanceTypes';

export const FinanceApprovals: React.FC = () => {
  const { approvalRequests, approveRequest, rejectRequest } = useFinanceStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [selectedReq, setSelectedReq] = useState<FinanceApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredRequests = approvalRequests.filter(req => {
    const matchesType = filterType === 'all' || req.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesType && matchesStatus;
  });

  const pendingCount = approvalRequests.filter(r => r.status.toLowerCase() === 'pending').length;
  const approvedCount = approvalRequests.filter(r => r.status.toLowerCase() === 'approved').length;
  const rejectedCount = approvalRequests.filter(r => r.status.toLowerCase() === 'rejected').length;

  const handleApprove = (id: string) => {
    approveRequest(id, 'Admin Owner');
  };

  const handleRejectClick = (req: FinanceApprovalRequest) => {
    setSelectedReq(req);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedReq && rejectReason) {
      rejectRequest(selectedReq.id, 'Admin Owner', rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedReq(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Executive Approval Workflow Center</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Authorizations required for high-value club expenses, member refunds, vendor bills, and payroll releases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-xl text-xs font-bold">
            {pendingCount} Awaiting Your Sign-off
          </span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterStatus('pending')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'pending' ? 'bg-amber-500/10 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Decisions</span>
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2">{pendingCount}</div>
          <p className="text-xs text-amber-600 mt-1">Requires CFO / Committee approval</p>
        </div>

        <div 
          onClick={() => setFilterStatus('approved')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-300 ring-2 ring-emerald-400' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved This Cycle</span>
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-2">{approvedCount}</div>
          <p className="text-xs text-emerald-600 mt-1">Released for payment execution</p>
        </div>

        <div 
          onClick={() => setFilterStatus('rejected')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'rejected' ? 'bg-rose-500/10 border-rose-300 ring-2 ring-rose-400' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Rejected / Flagged</span>
            <span className="p-2 bg-rose-100 text-rose-700 rounded-xl"><XCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-rose-800 mt-2">{rejectedCount}</div>
          <p className="text-xs text-rose-600 mt-1">Sent back with audit comments</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'expense', label: 'Club Expenses' },
            { id: 'refund', label: 'Member Refunds' },
            { id: 'vendor', label: 'Vendor Payments' },
            { id: 'payroll', label: 'Staff Payroll' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterType === tab.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Only Pending</option>
            <option value="approved">Only Approved</option>
            <option value="rejected">Only Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Request Stream */}
      <div className="space-y-3">
        {filteredRequests.map(req => {
          const isPending = req.status.toLowerCase() === 'pending';
          const isApproved = req.status.toLowerCase() === 'approved';
          const isRejected = req.status.toLowerCase() === 'rejected';

          return (
            <div 
              key={req.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl flex-shrink-0 ${
                  isApproved ? 'bg-emerald-50 text-emerald-600' :
                  isRejected ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {req.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isApproved ? 'bg-emerald-100 text-emerald-700' :
                      isRejected ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{req.title || req.description || req.justification}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span>Requested by: <strong className="text-slate-700">{req.requestedBy}</strong></span>
                    <span>Date: {req.requestDate}</span>
                    <span>Cost Center: <strong className="text-slate-700">{req.department}</strong></span>
                    {req.rejectionReason && (
                      <span className="text-rose-600 font-semibold">Reason: {req.rejectionReason}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="text-xs text-slate-400 font-medium">Authorization Value</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">₹{req.amount.toLocaleString('en-IN')}</div>
                </div>

                {isPending ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectClick(req)}
                      className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-medium">
                    {isApproved ? `Approved by ${req.approvedBy || 'Admin Owner'}` : 'Rejected'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Reject Approval Request</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please enter an audit trail justification for rejecting {selectedReq.id} (₹{selectedReq.amount.toLocaleString('en-IN')})
            </p>
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Audit Justification</label>
              <textarea 
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Quotation missing secondary approval, or budget exceeded..."
                className="w-full mt-1.5 p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
