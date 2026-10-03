import React from 'react';
import { FinanceApprovalRequest } from '../../types/FinanceTypes';
import { Check, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface FinanceApprovalWidgetProps {
  requests: FinanceApprovalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewAll?: () => void;
}

export const FinanceApprovalWidget: React.FC<FinanceApprovalWidgetProps> = ({
  requests,
  onApprove,
  onReject,
  onViewAll,
}) => {
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pending Financial Approvals
            </h3>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
              {pendingRequests.length}
            </span>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Approval Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-3 my-3">
          {pendingRequests.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 truncate">
                    {req.title}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                      req.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                  <span>Req by: {req.requestedBy}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{req.department}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-black text-slate-900 block">
                  ₹ {req.amount.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => onApprove(req.id)}
                    className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(req.id)}
                    className="p-1 rounded-lg bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-600 transition-colors"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs font-bold">All approval requests cleared!</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Dual authorization enabled</span>
        <span>Role: <strong className="text-slate-800">CFO / Club Treasurer</strong></span>
      </div>
    </div>
  );
};
