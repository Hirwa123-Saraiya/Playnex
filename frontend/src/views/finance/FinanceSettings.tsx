import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  Settings, 
  Building2, 
  Calendar, 
  Percent, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  CreditCard,
  Bell,
  Layers
} from 'lucide-react';

export const FinanceSettings: React.FC = () => {
  const { activeFiscalYear, setActiveFiscalYear, branches, activeBranchId, setActiveBranchId } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'fiscal' | 'taxes' | 'approvals' | 'gateways'>('fiscal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [gstin, setGstin] = useState('27AAACP0123M1Z8');
  const [pan, setPan] = useState('AAACP0123M');
  const [legalName, setLegalName] = useState('Playnex Sports Club Private Limited');
  const [lockDate, setLockDate] = useState('2025-09-30');
  
  // Approval Limits
  const [limits, setLimits] = useState({
    supervisor: 10000,
    clubManager: 50000,
    generalManager: 200000,
    cfo: 1000000
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Finance & Accounting Configuration</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Global fiscal year policies, tax slabs, multi-tier approval thresholds, and payment gateway webhooks
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
        <button
          onClick={() => setActiveTab('fiscal')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'fiscal' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Fiscal Year & Period Lock
        </button>
        <button
          onClick={() => setActiveTab('taxes')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'taxes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          GST & Tax Codes
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'approvals' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approval Matrix
        </button>
        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'gateways' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payment Gateways & POS
        </button>
      </div>

      {/* TAB 1: FISCAL YEAR & LOCK */}
      {activeTab === 'fiscal' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Fiscal Setup & Period Freezing</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control open accounting books and prevent back-dated alterations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Active Financial Year</label>
                <select 
                  value={activeFiscalYear}
                  onChange={(e) => setActiveFiscalYear(e.target.value)}
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                >
                  <option value="2025-26">FY 2025-26 (01 Apr 2025 – 31 Mar 2026)</option>
                  <option value="2024-25">FY 2024-25 (01 Apr 2024 – 31 Mar 2025)</option>
                  <option value="2023-24">FY 2023-24 (Audited & Closed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Accounting Freeze / Lock Date</label>
                <input 
                  type="date"
                  value={lockDate}
                  onChange={(e) => setLockDate(e.target.value)}
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Transactions prior to this date cannot be created or modified by standard users.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Reporting Currency</label>
                <input 
                  type="text"
                  disabled
                  value="INR - Indian Rupee (₹)"
                  className="w-full mt-1.5 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Club Registered Entity Name</label>
                <input 
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">PAN Number</label>
                <input 
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Period Lock Policy Active
                </div>
                <p>
                  Any adjustments to historical quarters require secondary authorization from the Audit Committee.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAXES */}
      {activeTab === 'taxes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">GST Registration & Tax Rate Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">Define department-specific GST slabs and HSN/SAC classifications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Primary Club GSTIN</label>
              <input 
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Place of Supply (State)</label>
              <input 
                type="text"
                disabled
                value="27 - Maharashtra"
                className="w-full mt-1.5 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-600"
              />
            </div>
          </div>

          {/* Department Slab Mapping */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Club Department</th>
                  <th className="py-2.5 px-4">SAC / HSN Code</th>
                  <th className="py-2.5 px-4 text-center">Tax Slab</th>
                  <th className="py-2.5 px-4 text-center">CGST + SGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { dept: 'Membership Dues & Subscriptions', sac: '999599', slab: '18% GST', split: '9% + 9%' },
                  { dept: 'Court & Turf Booking Services', sac: '999691', slab: '18% GST', split: '9% + 9%' },
                  { dept: 'Restaurant & Dining (Non-AC/AC)', sac: '996331', slab: '5% GST (No ITC)', split: '2.5% + 2.5%' },
                  { dept: 'Bar & Alcohol Counter', sac: '220800', slab: 'State Liquor VAT (20%)', split: 'State Revenue' },
                  { dept: 'Pro Shop Sports Apparel & Equipment', sac: '950600', slab: '12% GST', split: '6% + 6%' },
                  { dept: 'Banquet Hall & Event Hosting', sac: '997212', slab: '18% GST', split: '9% + 9%' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.dept}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.sac}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.slab}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{row.split}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVAL MATRIX */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Delegation of Financial Authority (DoFA)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Maximum financial release caps by role before escalating to higher authority</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Tier 1: Department Lead</span>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400">Spending Cap</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input 
                    type="number"
                    value={limits.supervisor}
                    onChange={(e) => setLimits({...limits, supervisor: Number(e.target.value)})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Tier 2: Club Manager</span>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400">Spending Cap</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input 
                    type="number"
                    value={limits.clubManager}
                    onChange={(e) => setLimits({...limits, clubManager: Number(e.target.value)})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Tier 3: General Manager</span>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400">Spending Cap</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input 
                    type="number"
                    value={limits.generalManager}
                    onChange={(e) => setLimits({...limits, generalManager: Number(e.target.value)})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Tier 4: CFO / Board</span>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400">Spending Cap</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input 
                    type="number"
                    value={limits.cfo}
                    onChange={(e) => setLimits({...limits, cfo: Number(e.target.value)})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GATEWAYS */}
      {activeTab === 'gateways' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment Processors & Club POS Terminals</h3>
            <p className="text-xs text-slate-500 mt-0.5">Integrate automated webhooks for dynamic UPI QR, member card swipes, and refunds</p>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Razorpay PG & Smart UPI Router', status: 'Active & Verified', desc: 'Accepts UPI AutoPay, Net Banking, and Credit Cards for member renewals', key: 'rzp_live_992****' },
              { name: 'PineLabs EDC Smart Terminals (Bar & Shop)', status: 'Connected', desc: 'Hardware POS integration with auto-settlement to ICICI Current Account', key: 'pine_term_4401' },
              { name: 'Member Pre-loaded Club Wallet Engine', status: 'Operational', desc: 'Closed-loop digital wallet system for cashless club transactions', key: 'wallet_engine_v2' },
            ].map((gw, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{gw.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {gw.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{gw.desc}</p>
                  <span className="font-mono text-[11px] text-slate-400 mt-1 block">Key: {gw.key}</span>
                </div>
                <button className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition">
                  Configure
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
