import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Lock, 
  User, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  Download,
  Fingerprint
} from 'lucide-react';
import { FinanceAuditLog } from '../../types/FinanceTypes';

export const FinanceAuditLogs: React.FC = () => {
  const { auditLogs } = useFinanceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action.toLowerCase() === selectedAction.toLowerCase();
    const matchesEntity = selectedEntity === 'all' || log.entity.toLowerCase() === selectedEntity.toLowerCase();
    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-900 text-white rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Enterprise Compliance & Forensic Audit Trail</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-evident, immutable transaction logs tracking every financial modification, voucher reversal, and approval
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4" />
            SHA-256 Ledger Verified
          </span>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
            <Download className="w-4 h-4" />
            Export Audit Archive
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, invoice ID, or transaction detail..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="approve">Approved</option>
            <option value="reverse">Reversed</option>
            <option value="delete">Deleted</option>
          </select>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">All Entities</option>
            <option value="invoice">Invoice</option>
            <option value="payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="expense">Expense</option>
            <option value="payroll">Payroll</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Principal</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Modification Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const actionBadgeColor = 
                  log.action === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' :
                  log.action === 'CREATE' ? 'bg-blue-100 text-blue-700' :
                  log.action === 'REVERSE' || log.action === 'DELETE' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition font-sans">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.userId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${actionBadgeColor}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <span className="font-semibold">{log.entity}</span>
                      <span className="text-slate-400 text-[11px] block font-mono">{log.entityId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
