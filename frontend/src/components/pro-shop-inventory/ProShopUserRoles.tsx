import React from 'react';
import { 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Key,
  ShieldAlert,
  Users
} from 'lucide-react';
import { mockUserRoles } from '../../mock/ProShopInventoryMockData';

export const ProShopUserRoles: React.FC = () => {
  const permissionsMatrix = [
    { feature: 'Product Catalog (Add / Edit / Delete)', super: true, club: true, manager: false, staff: false, member: false },
    { feature: 'Central Inventory Stock Tracking', super: true, club: true, manager: true, staff: false, member: false },
    { feature: 'Supplier Purchase Orders & GRN', super: true, club: false, manager: true, staff: false, member: false },
    { feature: 'Counter POS Billing & Barcode Scan', super: true, club: true, manager: true, staff: true, member: false },
    { feature: 'Authorize Member Refunds', super: true, club: true, manager: false, staff: false, member: false },
    { feature: 'Browse Online Store & Member Perks', super: true, club: true, manager: true, staff: true, member: true },
    { feature: 'Financial Analytics & Valuation MIS', super: true, club: true, manager: false, staff: false, member: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
          11
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">User Roles & Access Control</h2>
          <p className="text-xs text-slate-500 font-medium">Fine-grained operational permissions across club employees and registered sports members</p>
        </div>
      </div>

      {/* 5 User Role Cards matching Reference Image Card 11 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {mockUserRoles.map((r, idx) => (
          <div
            key={r.role}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-sm">
                  {idx === 0 ? '👑' : idx === 1 ? '👔' : idx === 2 ? '📦' : idx === 3 ? '💳' : '🎾'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                  {r.badge}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-3">{r.role}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{r.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Permitted Modules:</span>
              <div className="flex flex-wrap gap-1">
                {r.permissions.slice(0, 3).map((perm, pIdx) => (
                  <span key={pIdx} className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[9px] font-medium truncate max-w-full">
                    {perm}
                  </span>
                ))}
                {r.permissions.length > 3 && (
                  <span className="text-[9px] text-blue-600 font-bold self-center">
                    +{r.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
          Role-Based Access Control (RBAC) Governance Matrix
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">System Operational Capability</th>
                <th className="py-2.5 px-3 text-center">Super Admin</th>
                <th className="py-2.5 px-3 text-center">Club Admin</th>
                <th className="py-2.5 px-3 text-center">Store Manager</th>
                <th className="py-2.5 px-3 text-center">Sales Staff</th>
                <th className="py-2.5 px-3 text-center">Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-semibold text-slate-900">{row.feature}</td>
                  <td className="py-3 px-3 text-center">
                    {row.super ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.club ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.staff ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.member ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
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
