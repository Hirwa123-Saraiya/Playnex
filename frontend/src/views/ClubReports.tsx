'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  PieChart,
  LineChart,
  TrendingUp,
} from 'lucide-react';

export const ClubReports: React.FC = () => {
  const { selectedBranch } = useClub();

  const reportPacks = [
    {
      title: 'Court & Slot Utilization Heatmap',
      desc: 'Hourly occupancy density for Tennis Courts 1-6 & Badminton Arena',
      period: 'Monthly (Sep - Oct 2025)',
      format: 'PDF / Excel',
      updated: '14 Oct 2025, 06:00 AM',
    },
    {
      title: 'Departmental P&L & Revenue Distribution',
      desc: 'Net gross margin by F&B, Courts, Coaching Academy and Pro Shop',
      period: 'Q3 Financial Audit',
      format: 'CSV / PDF',
      updated: '12 Oct 2025',
    },
    {
      title: 'Member Retention & Churn Probability',
      desc: 'Predictive renewal health index across Gold, Silver & Junior tiers',
      period: 'Rolling 90 Days',
      format: 'Interactive Bi-Dashboard',
      updated: 'Yesterday',
    },
    {
      title: 'Kitchen & Bar Inventory Consumption',
      desc: 'Spirits consumption, raw material shrinkage and average table spend',
      period: 'Weekly Consumption',
      format: 'Excel Spreadsheet',
      updated: '13 Oct 2025',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Reports & Business Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational analytics, member engagement metrics and P&L audit logs for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
      </div>

      {/* Grid of Report Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportPacks.map((rep, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {rep.format}
                </span>
                <span className="text-[11px] text-slate-400">{rep.updated}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3">{rep.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
              <p className="text-xs font-semibold text-slate-700 mt-2">Timeframe: {rep.period}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Validated by Playnex Engine</span>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors">
                <Download className="w-3.5 h-3.5" />
                Generate & Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
