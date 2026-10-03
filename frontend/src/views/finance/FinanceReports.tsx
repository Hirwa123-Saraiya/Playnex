import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Printer,
  ChevronRight,
  TrendingUp,
  Search
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'Revenue' | 'Expenses' | 'Statutory' | 'Operational' | 'Payroll';
  description: string;
  frequency: string;
  formats: ('PDF' | 'Excel' | 'CSV')[];
}

export const FinanceReports: React.FC = () => {
  const { activeFiscalYear, activeBranchId, branches } = useFinanceStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'REP-REV-01',
      name: 'Daily Revenue & Department Cash Collection',
      category: 'Revenue',
      description: 'Breakdown of daily receipts by Court Booking, POS Bar & Cafe, Pro Shop, and Membership dues',
      frequency: 'Daily',
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'REP-REV-02',
      name: 'Monthly Revenue Target vs Actuals by Cost Center',
      category: 'Revenue',
      description: 'Comprehensive analysis of budget variance across 12 sports club revenue departments',
      frequency: 'Monthly',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'REP-EXP-01',
      name: 'Categorized Expense Ledger & Vouchers',
      category: 'Expenses',
      description: 'Itemized vendor payouts, utility bills, turf maintenance contracts, and kitchen purchases',
      frequency: 'Monthly',
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'REP-STAT-01',
      name: 'GSTR-1 & GSTR-3B Statutory Tax Ledger',
      category: 'Statutory',
      description: 'State-wise outward tax invoices, B2B, B2C, HSN summary, and ITC input tax reconciliation',
      frequency: 'Monthly / Quarterly',
      formats: ['Excel', 'CSV', 'PDF']
    },
    {
      id: 'REP-STAT-02',
      name: 'Certified Profit & Loss (Income Statement)',
      category: 'Statutory',
      description: 'Audited monthly EBITDA, operating surplus, depreciation charges, and net profit',
      frequency: 'Monthly / Annual',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'REP-OP-01',
      name: 'Debtor Aging & Outstanding Receivables Schedule',
      category: 'Operational',
      description: '30, 60, 90+ days aging schedule for corporate club members, sponsors, and banquet bookings',
      frequency: 'Weekly',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'REP-OP-02',
      name: 'Top Selling F&B Items & Inventory Turn',
      category: 'Operational',
      description: 'Sales velocity, unit margins, and wastage analysis for Bar, Cafe, and Sports Pro Shop',
      frequency: 'Weekly',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'REP-PAY-01',
      name: 'Consolidated Staff Payroll & Statutory Deductions',
      category: 'Payroll',
      description: 'Gross compensation, PF, ESI, TDS deductions, coach retainers, and net bank disburals',
      frequency: 'Monthly',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'REP-BRANCH-01',
      name: 'Branch Profitability & Cost Efficiency Benchmark',
      category: 'Operational',
      description: 'Comparative performance matrix across Central Club, Downtown Annex, and Suburban Sports Hub',
      frequency: 'Quarterly',
      formats: ['PDF', 'Excel']
    }
  ];

  const filteredReports = reportTemplates.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (id: string, format: string) => {
    setGeneratingReportId(`${id}-${format}`);
    setTimeout(() => {
      setGeneratingReportId(null);
      alert(`Report ${id} has been generated in ${format} format and downloaded successfully.`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Financial Reports & Regulatory Audit Exports</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generate certified MIS reports, statutory statements, GST tax logs, and departmental profitability analyses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Active Fiscal Year: <strong className="text-slate-800">{activeFiscalYear}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['all', 'Revenue', 'Expenses', 'Statutory', 'Operational', 'Payroll'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Reports' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report templates..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div 
            key={report.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  report.category === 'Revenue' ? 'bg-emerald-50 text-emerald-700' :
                  report.category === 'Expenses' ? 'bg-rose-50 text-rose-700' :
                  report.category === 'Statutory' ? 'bg-purple-50 text-purple-700' :
                  report.category === 'Payroll' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {report.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {report.frequency}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{report.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{report.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono font-medium">{report.id}</span>
              <div className="flex items-center gap-1.5">
                {report.formats.map(fmt => {
                  const isBusy = generatingReportId === `${report.id}-${fmt}`;
                  return (
                    <button
                      key={fmt}
                      onClick={() => handleDownload(report.id, fmt)}
                      disabled={isBusy}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition flex items-center gap-1"
                    >
                      <Download className="w-3 h-3 text-slate-400" />
                      {isBusy ? 'Generating...' : fmt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log / Recent Reports Generated */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Recent Automated Export Dispatches</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {[
            { name: 'Monthly Revenue Target vs Actuals - Oct 2025', by: 'CFO Office', date: '03 Oct 2025, 05:30 PM', size: '2.4 MB', type: 'PDF' },
            { name: 'GSTR-1 Tax Return Invoices Batch - Q2', by: 'Tax Compliance Bot', date: '02 Oct 2025, 11:15 AM', size: '1.1 MB', type: 'Excel' },
            { name: 'Staff Net Salary Disbursement Schedule', by: 'HR Payroll Admin', date: '01 Oct 2025, 09:00 AM', size: '890 KB', type: 'CSV' },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">{item.name}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Generated by <strong className="text-slate-600">{item.by}</strong> on {item.date} • {item.size}
                </div>
              </div>
              <button className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-blue-600 rounded-lg font-semibold flex items-center gap-1 transition">
                <Download className="w-3.5 h-3.5" /> Re-download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
