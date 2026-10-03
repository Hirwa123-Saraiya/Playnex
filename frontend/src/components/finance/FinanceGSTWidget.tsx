import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { mockGSTSummary } from '../../mock/FinanceMockData';

interface FinanceGSTWidgetProps {
  onViewDetails?: () => void;
}

export const FinanceGSTWidget: React.FC<FinanceGSTWidgetProps> = ({ onViewDetails }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                GST & Statutory Tax Filing
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Period: {mockGSTSummary.period}
              </span>
            </div>
          </div>

          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-1 rounded-full">
            Due {mockGSTSummary.dueDate}
          </span>
        </div>

        {/* GST Calculation Breakdown */}
        <div className="my-4 space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Gross Output GST Collected:</span>
            <span className="font-extrabold text-slate-900">
              ₹ {mockGSTSummary.totalOutputGST.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>Eligible Input Tax Credit (ITC):</span>
            <span className="font-extrabold text-emerald-600">
              - ₹ {mockGSTSummary.totalInputGST.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between text-purple-900 font-black">
            <span>Net GST Liability Payable:</span>
            <span className="text-base text-purple-950 font-black">
              ₹ {mockGSTSummary.netPayableGST.toLocaleString()}
            </span>
          </div>
        </div>

        {/* GSTR Filing Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700">GSTR-1</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              {mockGSTSummary.gstr1Status}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700">GSTR-3B</span>
            <span className="text-amber-700 font-extrabold flex items-center gap-1 text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              {mockGSTSummary.gstr3bStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => alert('Downloading GST Challan PDF (PMT-06)...')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Challan</span>
        </button>

        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Full Tax Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
