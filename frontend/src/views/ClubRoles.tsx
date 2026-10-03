'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  Shield,
  Users,
  Lock,
  Plus,
  CheckCircle,
  Key,
  ShieldAlert,
} from 'lucide-react';

export const ClubRoles: React.FC = () => {
  const { selectedBranch } = useClub();

  const roleHierarchy = [
    {
      role: 'Super Admin',
      scope: 'Multi-Tenant Platform Level',
      users: 2,
      permissions: 'Global root, Tenant provisioning, Billing engine, Database administration',
    },
    {
      role: 'Support Admin',
      scope: 'Playnex Operational Ops',
      users: 5,
      permissions: 'Technical diagnostics, Audit traces, System maintenance',
    },
    {
      role: 'Club Owner (You)',
      scope: 'Club & All Assigned Branches',
      users: 3,
      permissions: 'Full governance, Financial settlements, Department budgets, Approvals, Staff hiring',
    },
    {
      role: 'Department Manager',
      scope: 'Single Department (e.g. F&B or Sports)',
      users: 8,
      permissions: 'Roster scheduling, Table billing, Court slot configuration, Inventory approval',
    },
    {
      role: 'Staff & Front Desk',
      scope: 'Counter & Reception',
      users: 32,
      permissions: 'Member check-in, Walk-in court slot booking, POS order entry, RFID issuance',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Multi-tier permission hierarchy: Super Admin → Support Admin → Club Owner → Departments → Roles → Staff
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>

      {/* Role Hierarchy Cards */}
      <div className="space-y-4">
        {roleHierarchy.map((r, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{r.role}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {r.scope}
                </span>
              </div>
              <p className="text-xs text-slate-500">{r.permissions}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">
                {r.users} Assigned Users
              </span>
              <button className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                Configure Permissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
