import React from 'react';
import { Users, DollarSign, Download, CheckCircle2, Clock } from 'lucide-react';

export const FinancePayroll: React.FC = () => {
  const payrollList = [
    { id: 'EMP-101', name: 'Vikram Singh', role: 'Head Steward', dept: 'Restaurant', basic: 32000, overtime: 4200, deductions: 2800, net: 33400, status: 'Disbursed' },
    { id: 'EMP-102', name: 'Chef Sanjeev Kumar', role: 'Executive Chef', dept: 'Kitchen', basic: 65000, overtime: 0, deductions: 5800, net: 59200, status: 'Disbursed' },
    { id: 'EMP-103', name: 'Alex Fernandes', role: 'Master Mixologist', dept: 'Bar', basic: 38000, overtime: 6500, deductions: 3200, net: 41300, status: 'Disbursed' },
    { id: 'EMP-104', name: 'Rohan Patil', role: 'Court Maintenance Supervisor', dept: 'Court Booking', basic: 28000, overtime: 2400, deductions: 2200, net: 28200, status: 'Disbursed' },
    { id: 'EMP-105', name: 'Kunal Joshi', role: 'Poolside Lifeguard Lead', dept: 'Poolside', basic: 26000, overtime: 1800, deductions: 2100, net: 25700, status: 'Disbursed' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payroll Processing & Staff Compensation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Biometric attendance integration, overtime compensation, provident fund (PF) deductions, and digital payslips.
          </p>
        </div>

        <button
          onClick={() => alert('Generating digital payslips PDF batch...')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download All Payslips</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role & Department</th>
                <th className="py-3 px-4 text-right">Basic Pay</th>
                <th className="py-3 px-4 text-right">Overtime / Bonus</th>
                <th className="py-3 px-4 text-right">PF & Deductions</th>
                <th className="py-3 px-4 text-right">Net Disbursed</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {payrollList.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block">{emp.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{emp.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{emp.role}</span>
                    <span className="text-[10px] text-slate-400">{emp.dept}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700">₹ {emp.basic.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">+₹ {emp.overtime.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-rose-600">-₹ {emp.deductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                    ₹ {emp.net.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
