import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  SlidersHorizontal,
  Calendar,
  Building2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { FinanceDepartment } from '../../types/FinanceTypes';

export const FinanceBudget: React.FC = () => {
  const { budgets, branches, activeBranchId, activeFiscalYear } = useFinanceStore();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredBudgets = budgets.filter(b => 
    (activeBranchId === 'all' || !b.branchId || b.branchId === activeBranchId) &&
    (selectedDept === 'all' || b.department === selectedDept)
  );

  const totalAllocated = filteredBudgets.reduce((acc, curr) => acc + (curr.allocatedBudget || curr.allocatedAmount || 0), 0);
  const totalUtilized = filteredBudgets.reduce((acc, curr) => acc + (curr.actualSpent || curr.utilizedAmount || 0), 0);
  const totalRemaining = totalAllocated - totalUtilized;
  const overallUtilizationRate = totalAllocated > 0 ? (totalUtilized / totalAllocated) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Annual & Departmental Budget Control</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track allocated funds, real-time burn rates, and variance analysis across club cost centers for {activeFiscalYear}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Cost Centers</option>
            <option value="Court Booking">Court Booking</option>
            <option value="Bar">Bar</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Shop">Pro Shop</option>
            <option value="Events">Tournaments & Events</option>
            <option value="Membership">Membership</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Budget Allocation
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Budget Allocated</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Target className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">₹{(totalAllocated / 100000).toFixed(2)}L</div>
          <p className="text-xs text-slate-400 mt-1">{activeFiscalYear} Sanctioned Cap</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Utilized (YTD)</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">₹{(totalUtilized / 100000).toFixed(2)}L</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${overallUtilizationRate > 90 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                style={{ width: `${Math.min(overallUtilizationRate, 100)}%` }}
              />
            </div>
            <span className="font-bold">{overallUtilizationRate.toFixed(0)}%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Remaining Balance</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">₹{(totalRemaining / 100000).toFixed(2)}L</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Available for procurement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Variance Health</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><AlertCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overallUtilizationRate > 90 ? 'High Risk' : 'Within Norms'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cost centers within approved limits</p>
        </div>
      </div>

      {/* Budget Allocation Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBudgets.map((b) => {
          const allocated = b.allocatedBudget || b.allocatedAmount || 1;
          const spent = b.actualSpent || b.utilizedAmount || 0;
          const utilPct = Math.round((spent / allocated) * 100);
          const variance = b.varianceAmount ?? (allocated - spent);
          const isOver = utilPct > 90;

          return (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {b.department}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{activeFiscalYear}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{b.name || `${b.department} Operating Budget`}</h3>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  isOver ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {utilPct}% Used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                  <span>Burned: ₹{spent.toLocaleString('en-IN')}</span>
                  <span>Cap: ₹{allocated.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      utilPct >= 90 ? 'bg-rose-500' : utilPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilPct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Financial Specs */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Remaining</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">₹{(allocated - spent).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Variance Type</span>
                  <p className={`font-semibold text-sm mt-0.5 ${variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {variance >= 0 ? `+ ₹${variance.toLocaleString('en-IN')} Fav` : `- ₹${Math.abs(variance).toLocaleString('en-IN')} Adv`}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Status: {b.status}</span>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Adjust Cap →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Variance Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Cost-Center Variance Analysis Table</h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated comparison between budgeted targets and real-time ledger debits</p>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-600">
            Export Variance Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3 px-4">Cost Center / Line Item</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Allocated</th>
                <th className="py-3 px-4 text-right">Actual Utilized</th>
                <th className="py-3 px-4 text-right">Variance (Rs)</th>
                <th className="py-3 px-4 text-center">Utilization</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.map(b => {
                const allocated = b.allocatedBudget || b.allocatedAmount || 1;
                const spent = b.actualSpent || b.utilizedAmount || 0;
                const pct = Math.round((spent / allocated) * 100);
                const variance = b.varianceAmount ?? (allocated - spent);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{b.name || `${b.department} Operations`}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.department}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">₹{allocated.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-900">₹{spent.toLocaleString('en-IN')}</td>
                    <td className={`py-3.5 px-4 text-right font-bold ${variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {variance >= 0 ? `+ ₹${variance.toLocaleString('en-IN')}` : `- ₹${Math.abs(variance).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-800">{pct}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pct > 90 ? 'bg-rose-100 text-rose-700' : pct > 75 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {b.status}
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
