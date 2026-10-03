import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  ChevronDown,
  Info
} from 'lucide-react';

export const FinanceStatements: React.FC = () => {
  const { activeFiscalYear, activeBranchId, branches } = useFinanceStore();
  const [statementType, setStatementType] = useState<'pnl' | 'balance_sheet' | 'cash_flow'>('pnl');

  const selectedBranchName = activeBranchId === 'all' 
    ? 'All Club Branches (Consolidated)' 
    : branches.find(b => b.id === activeBranchId)?.name || 'Central Club';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Statutory Financial Statements</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            GAAP & Ind-AS compliant financial disclosures: Profit & Loss (Income Statement), Balance Sheet, and Cash Flows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
            <Download className="w-4 h-4" />
            Export Certified Statement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatementType('pnl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statementType === 'pnl' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Profit & Loss Statement
          </button>
          <button
            onClick={() => setStatementType('balance_sheet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statementType === 'balance_sheet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setStatementType('cash_flow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statementType === 'cash_flow' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Cash Flow Statement
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-3 hidden sm:block">
          Entity: <strong className="text-slate-800">{selectedBranchName}</strong> | Period: <strong className="text-slate-800">{activeFiscalYear}</strong>
        </div>
      </div>

      {/* PROFIT & LOSS STATEMENT */}
      {statementType === 'pnl' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">PLAYNEX SPORTS & COUNTRY CLUB</h2>
            <h3 className="text-sm font-semibold text-slate-600 mt-0.5">Statement of Profit and Loss</h3>
            <p className="text-xs text-slate-400 mt-0.5">For the period ended 31 October 2025 (All amounts in ₹ INR)</p>
          </div>

          <div className="space-y-4">
            {/* Revenue Section */}
            <div>
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                <span>I. REVENUE FROM OPERATIONS</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs px-2 mt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Membership Subscriptions & Annual Dues</span>
                  <span className="font-semibold text-slate-900">8,20,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Court Bookings & Turf Rentals</span>
                  <span className="font-semibold text-slate-900">6,50,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Bar & Dining / Banquet Services</span>
                  <span className="font-semibold text-slate-900">5,10,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Pro Shop & Sports Merchandise Sales</span>
                  <span className="font-semibold text-slate-900">4,80,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Tournaments & Corporate Sponsorship</span>
                  <span className="font-semibold text-slate-900">2,30,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Sports Academy & Coaching Fees</span>
                  <span className="font-semibold text-slate-900">1,55,000.00</span>
                </div>
                <div className="py-3 flex justify-between font-bold text-blue-700 bg-blue-50/50 rounded-lg px-4 mt-1">
                  <span>TOTAL REVENUE (A)</span>
                  <span>₹28,45,000.00</span>
                </div>
              </div>
            </div>

            {/* Direct Cost / COGS */}
            <div>
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                <span>II. DIRECT OPERATING COSTS & COGS</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs px-2 mt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">F&B Raw Materials & Liquors Consumed</span>
                  <span className="font-semibold text-slate-900">3,65,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Pro Shop Inventory Replenishment</span>
                  <span className="font-semibold text-slate-900">2,75,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Tournament Logistics & Prize Purses</span>
                  <span className="font-semibold text-slate-900">1,25,000.00</span>
                </div>
                <div className="py-3 flex justify-between font-bold text-slate-800 bg-slate-100/60 rounded-lg px-4 mt-1">
                  <span>TOTAL DIRECT COST (B)</span>
                  <span>₹7,65,000.00</span>
                </div>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="p-4 bg-emerald-50 border border-emerald-200/70 rounded-xl flex justify-between items-center font-bold text-emerald-900 text-sm">
              <span>GROSS PROFIT (A - B)</span>
              <span>₹20,80,000.00 (73.1%)</span>
            </div>

            {/* Operating Expenses */}
            <div>
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                <span>III. OPERATING & ADMINISTRATIVE EXPENSES</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs px-2 mt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Staff Salaries, Wages & Coach Retainers</span>
                  <span className="font-semibold text-slate-900">8,25,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Power, Utilities & Municipal Water</span>
                  <span className="font-semibold text-slate-900">1,45,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Turf, Pool & Court Maintenance</span>
                  <span className="font-semibold text-slate-900">1,28,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Depreciation & Amortization on Fixed Assets</span>
                  <span className="font-semibold text-slate-900">62,500.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-700 pl-4">Club Marketing, Software ERP & Admin Overheads</span>
                  <span className="font-semibold text-slate-900">72,500.00</span>
                </div>
                <div className="py-3 flex justify-between font-bold text-slate-800 bg-slate-100/60 rounded-lg px-4 mt-1">
                  <span>TOTAL OPERATING EXPENSES (C)</span>
                  <span>₹12,33,000.00</span>
                </div>
              </div>
            </div>

            {/* Bottom Line Net Profit */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl flex justify-between items-center font-bold text-base shadow-md">
              <div>
                <div>NET PROFIT BEFORE TAX</div>
                <div className="text-xs font-normal text-emerald-100 mt-0.5">Operating Surplus after all overheads</div>
              </div>
              <div className="text-2xl font-black">₹10,13,000.00</div>
            </div>
          </div>
        </div>
      )}

      {/* BALANCE SHEET */}
      {statementType === 'balance_sheet' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">PLAYNEX SPORTS & COUNTRY CLUB</h2>
            <h3 className="text-sm font-semibold text-slate-600 mt-0.5">Statement of Financial Position (Balance Sheet)</h3>
            <p className="text-xs text-slate-400 mt-0.5">As of 31 October 2025 (All amounts in ₹ INR)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ASSETS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                <span>ASSETS</span>
                <span>Amount (₹)</span>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 px-2 pt-2">Non-Current Assets</div>
                <div className="divide-y divide-slate-100 px-4">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Property, Plant & Courts</span>
                    <span className="font-semibold text-slate-900">1,45,00,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Gym & Aquatic Equipment</span>
                    <span className="font-semibold text-slate-900">32,40,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Accumulated Depreciation</span>
                    <span className="font-semibold text-rose-600">-24,50,000.00</span>
                  </div>
                </div>

                <div className="font-bold text-slate-900 px-2 pt-3">Current Assets</div>
                <div className="divide-y divide-slate-100 px-4">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">F&B & Pro Shop Inventories</span>
                    <span className="font-semibold text-slate-900">8,90,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Accounts Receivable (Debtors)</span>
                    <span className="font-semibold text-slate-900">4,25,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Cash & Treasury Bank Balances</span>
                    <span className="font-semibold text-slate-900">10,40,000.00</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-900 font-bold rounded-xl flex justify-between mt-4">
                  <span>TOTAL ASSETS</span>
                  <span>₹1,76,45,000.00</span>
                </div>
              </div>
            </div>

            {/* LIABILITIES & EQUITY */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-900 uppercase tracking-wider">
                <span>EQUITY & LIABILITIES</span>
                <span>Amount (₹)</span>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 px-2 pt-2">Members' Equity & Reserves</div>
                <div className="divide-y divide-slate-100 px-4">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Club Corpus Fund</span>
                    <span className="font-semibold text-slate-900">1,20,00,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Retained Surplus / Net Earnings</span>
                    <span className="font-semibold text-slate-900">42,85,700.00</span>
                  </div>
                </div>

                <div className="font-bold text-slate-900 px-2 pt-3">Current Liabilities</div>
                <div className="divide-y divide-slate-100 px-4">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Accounts Payable (Vendor Creditors)</span>
                    <span className="font-semibold text-slate-900">6,12,000.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">GST Output Tax Liability (Net)</span>
                    <span className="font-semibold text-slate-900">1,22,300.00</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Advance Membership Subscriptions</span>
                    <span className="font-semibold text-slate-900">6,25,000.00</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 text-indigo-900 font-bold rounded-xl flex justify-between mt-4">
                  <span>TOTAL LIABILITIES & EQUITY</span>
                  <span>₹1,76,45,000.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Balance Sheet is in equilibrium. Total Assets = Total Liabilities & Equity.
          </div>
        </div>
      )}

      {/* CASH FLOW STATEMENT */}
      {statementType === 'cash_flow' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">PLAYNEX SPORTS & COUNTRY CLUB</h2>
            <h3 className="text-sm font-semibold text-slate-600 mt-0.5">Statement of Cash Flows (Direct Method)</h3>
            <p className="text-xs text-slate-400 mt-0.5">For the month of October 2025</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Operating */}
            <div>
              <div className="bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-slate-900 flex justify-between">
                <span>CASH FLOWS FROM OPERATING ACTIVITIES</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 px-4 mt-1">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-700">Cash receipts from members & bookings</span>
                  <span className="font-semibold text-slate-900">26,45,000.00</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-700">Cash paid to staff, suppliers & operating utilities</span>
                  <span className="font-semibold text-rose-600">-17,80,000.00</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-700">GST and statutory taxes remitted</span>
                  <span className="font-semibold text-rose-600">-1,15,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between font-bold text-emerald-700">
                  <span>Net Cash Generated from Operating Activities</span>
                  <span>+₹7,50,000.00</span>
                </div>
              </div>
            </div>

            {/* Investing */}
            <div>
              <div className="bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-slate-900 flex justify-between">
                <span>CASH FLOWS FROM INVESTING ACTIVITIES</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 px-4 mt-1">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-700">Purchase of Pickleball Court Floodlights & Turf Equipment</span>
                  <span className="font-semibold text-rose-600">-2,30,000.00</span>
                </div>
                <div className="py-2.5 flex justify-between font-bold text-rose-600">
                  <span>Net Cash Used in Investing Activities</span>
                  <span>-₹2,30,000.00</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex justify-between px-4 py-2 font-medium text-slate-600">
                <span>Opening Cash & Cash Equivalents (01 Oct 2025)</span>
                <span>₹5,20,000.00</span>
              </div>
              <div className="flex justify-between px-4 py-2 font-bold text-slate-900">
                <span>Net Increase in Cash & Equivalents</span>
                <span className="text-emerald-600">+₹5,20,000.00</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-900 text-white rounded-xl font-bold text-sm">
                <span>Closing Cash & Bank Balance (31 Oct 2025)</span>
                <span className="text-emerald-400">₹10,40,000.00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
