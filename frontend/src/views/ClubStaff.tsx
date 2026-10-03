'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClub } from '../context/ClubContext';
import {
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Trophy,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Landmark,
  ShieldAlert,
  Check,
  Copy,
  UserCog,
  Wrench,
  X,
} from 'lucide-react';

const WORKSTATION_DEFINITIONS = [
  {
    roleName: 'Shop Manager',
    emailSlug: 'shop',
    subAccountType: 'Pro Shop',
    department: 'Pro Shop & Gear Inventory',
    icon: ShoppingBag,
    targetNav: 'Standalone Pro Shop Suite',
    targetPath: '/pro-shop',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Central stock, item SKU inventory, POS counter barcode checkout, emergency restock & stringing.',
    defaultPermissions: [
      'shop:create',
      'shop:read',
      'shop:update',
      'shop:stock',
      'shop:sell',
      'inventory:audit',
      'gst:invoice',
    ],
  },
  {
    roleName: 'Bar Manager',
    emailSlug: 'bar',
    subAccountType: 'Bar & Kitchen',
    department: 'Food & Beverage (Restaurant & Bar)',
    icon: UtensilsCrossed,
    targetNav: 'Standalone Bar & Kitchen POS',
    targetPath: '/bar-kitchen',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Bar tables, tabs, kitchen order tickets (KOT), closing day-end reconciliations.',
    defaultPermissions: [
      'bar:create',
      'bar:read',
      'bar:update',
      'bar:settle',
      'bar:void',
      'kot:dispatch',
    ],
  },
  {
    roleName: 'Front Desk',
    emailSlug: 'frontdesk',
    subAccountType: 'Front Desk',
    department: 'Front Desk & Reception',
    icon: CalendarDays,
    targetNav: 'Standalone Front Desk Station',
    targetPath: '/front-desk',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Manages walk-ins, phone calls, player check-in, court schedule locks & inquiries.',
    defaultPermissions: [
      'booking:create',
      'booking:read',
      'booking:update',
      'booking:cancel',
      'walkin:checkin',
      'member:read',
    ],
  },
  {
    roleName: 'Accountant',
    emailSlug: 'accountant',
    subAccountType: 'Finance',
    department: 'Finance & Accounting',
    icon: IndianRupee,
    targetNav: 'Standalone Finance ERP',
    targetPath: '/finance',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Financial ledgers, 18% GST invoice generation, staff payroll, and government tax compliance audits.',
    defaultPermissions: [
      'finance:read',
      'finance:invoice',
      'finance:payroll',
      'finance:tax',
      'gst:audit',
    ],
  },
  {
    roleName: 'Coach',
    emailSlug: 'coach',
    subAccountType: 'Coaching',
    department: 'Sports Academy & Coaching',
    icon: Trophy,
    targetNav: 'Standalone Coaching Station',
    targetPath: '/coach',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'View coaching calendar, junior academy sessions, player skill assessments, and weekend tournaments.',
    defaultPermissions: [
      'booking:read',
      'member:read',
      'event:read',
      'clinic:schedule',
    ],
  },
  {
    roleName: 'HR',
    emailSlug: 'hr',
    subAccountType: 'HR',
    department: 'Human Resources & Personnel',
    icon: UserCog,
    targetNav: 'Standalone HR Station',
    targetPath: '/hr',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Staff onboarding, attendance schedules, leave approvals, and shift rotations.',
    defaultPermissions: [
      'staff:read',
      'staff:manage',
      'staff:schedule',
      'staff:approve_leave',
    ],
  },
  {
    roleName: 'Groundskeeper',
    emailSlug: 'grounds',
    subAccountType: 'Groundskeeper',
    department: 'Court & Facility Operations',
    icon: Wrench,
    targetNav: 'Standalone Facility Ops Station',
    targetPath: '/facility-ops',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Facility maintenance, wooden court recoating, net tension checks, and court availability toggling.',
    defaultPermissions: [
      'facility:read',
      'facility:update',
      'court:toggle_availability',
      'maintenance:log',
    ],
  },
];

export const ClubStaff: React.FC = () => {
  const router = useRouter();
  const { club, setActiveNav } = useClub();

  // Copied State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compliance Modal State
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  const clubClean = (club.name || 'club').toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleCopyCredentials = (copyEmail: string, copyPass: string, id: string) => {
    navigator.clipboard.writeText(`Email: ${copyEmail}\nPassword: ${copyPass}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLaunchWorkspace = (targetNav: string, targetPath?: string) => {
    setActiveNav(targetNav);
    if (targetPath) {
      router.push(targetPath);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#1565D8] selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Official Workstations & Login Credentials
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Tenant Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Operational overview for Pro Shop, Bar, Front Desk, Accountant, Coach, HR, and Grounds with live login credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsComplianceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0B1F4D] text-xs font-bold rounded-xl border border-slate-200 transition-all shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#1565D8]" />
            <span>Gov & Tax Audit</span>
          </button>
        </div>
      </div>

      {/* Multi-Tenancy & Tax Compliance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071A3D] via-[#0B1F4D] to-[#1565D8] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-300 border border-white/10 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Multi-Tenant Data Isolation & Government GST Audit</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                18% GST Compliant
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              When workstation operators log in, they strictly see data for club owner{' '}
              <strong className="text-white underline">{club.name}</strong> (Tenant ID:{' '}
              <code className="text-amber-200 font-mono text-[11px]">{club.tenantId || 'tenant_active'}</code>). Each workstation lands on its own dedicated standalone dashboard with its own custom sidebar.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsComplianceModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors whitespace-nowrap self-end md:self-auto"
        >
          View Tax Compliance Trail →
        </button>
      </div>

      {/* WORKSTATION CARDS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0B1F4D]">7 Live Workstations</h2>
            <p className="text-xs text-[#64748B]">
              Staff members log in with these live credentials and land directly on their designated workstation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-lg">
            <span>Standard Password:</span>
            <strong className="text-[#0B1F4D]">Playnex@2026</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKSTATION_DEFINITIONS.map((ws) => {
            const Icon = ws.icon;
            const liveEmail = `${ws.emailSlug}.${clubClean}@playnex.com`;
            const genericEmail = `${ws.emailSlug}@playnex.com`;
            const isCopied = copiedId === ws.emailSlug;

            return (
              <div
                key={ws.emailSlug}
                className="bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1565D8] flex items-center justify-center font-bold shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#0B1F4D] text-sm">{ws.roleName}</h3>
                        <span className="text-[11px] text-[#64748B] font-medium">{ws.department}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ws.badgeClass}`}>
                      {ws.subAccountType}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] mb-4 leading-relaxed">{ws.description}</p>

                  {/* Destination Page Badge */}
                  <div className="p-2.5 rounded-xl bg-[#F7FAFC] border border-[#D9E6F5] mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium">Lands on Workstation:</span>
                      <span className="font-bold text-[#1565D8] flex items-center gap-1">
                        {ws.targetNav}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Credentials Box */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2 mb-3 shadow-inner">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Login Email:</span>
                      <code className="text-amber-300 font-mono font-semibold">{liveEmail}</code>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Station Password:</span>
                      <code className="text-emerald-400 font-mono font-semibold">Playnex@2026</code>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Also supports:</span>
                      <code className="text-slate-300">{genericEmail}</code>
                    </div>
                  </div>

                  {/* Permissions list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      Granted Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ws.defaultPermissions.slice(0, 4).map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-[#1E293B]">
                          {p}
                        </span>
                      ))}
                      {ws.defaultPermissions.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-[#64748B]">
                          +{ws.defaultPermissions.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="pt-4 mt-4 border-t border-[#D9E6F5] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyCredentials(liveEmail, 'Playnex@2026', ws.emailSlug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#0B1F4D] border border-slate-200'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Login'}</span>
                  </button>

                  <button
                    onClick={() => handleLaunchWorkspace(ws.targetNav, ws.targetPath)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold shadow-sm shadow-blue-900/20 transition-all"
                  >
                    <span>Launch Station</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Government & Multi-Tenant Tax Compliance Modal */}
      {isComplianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#1565D8]" />
                <div>
                  <h3 className="text-base font-bold text-[#0B1F4D]">Government & Multi-Tenant Audit Compliance</h3>
                  <p className="text-xs text-[#64748B]">State Tax GSTIN & Platform Multi-Tenancy Specifications</p>
                </div>
              </div>
              <button onClick={() => setIsComplianceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Registered Club Owner</span>
                  <span className="text-xs font-bold text-[#0B1F4D] mt-0.5 block">{club.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Tenant: {club.tenantId || 'tenant_active'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Club Tax GSTIN</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono mt-0.5 block">24AAACP1234M1Z5</span>
                  <span className="text-[11px] text-slate-500">18% GST Statutory Audited</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EAF3FF] border border-blue-200 text-[#0B1F4D] space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
                  <span>How Multi-Tenancy & Government Audit Works:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#1E293B] text-[11px]">
                  <li>
                    <strong>Tenant Isolation:</strong> Every workstation operated for {club.name} is cryptographically locked to Tenant ID{' '}
                    <code>{club.tenantId || 'tenant_active'}</code>. Personnel cannot access other clubs or cross-tenant databases.
                  </li>
                  <li>
                    <strong>Live Operator Stamping:</strong> When an inventory adjustment, pro shop checkout, bar bill, or court slot booking is performed by a workstation operator, their identity is recorded in the audit trail.
                  </li>
                  <li>
                    <strong>Government Oversight:</strong> Invoices generated are automatically reported in the Super Admin Platform Revenue and Government Tax Compliance modules for GST filing and statutory audits.
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-[#0B1F4D] block mb-2">Live Multi-Tenant Audit Trail Log</span>
                <div className="border border-[#D9E6F5] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#F7FAFC] border-b border-[#D9E6F5] text-slate-500 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Timestamp</th>
                        <th className="px-3 py-2">Staff Operator</th>
                        <th className="px-3 py-2">Module / Action</th>
                        <th className="px-3 py-2 text-right">GST Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9E6F5]/50">
                      <tr>
                        <td className="px-3 py-2 text-slate-500">Just Now</td>
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Shop Manager (Counter POS)</td>
                        <td className="px-3 py-2">Yonex Grip Tape</td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-semibold">18% GST (Tax Paid)</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-500">12 mins ago</td>
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Front Desk Receptionist</td>
                        <td className="px-3 py-2">Walk-in Booking: Badminton Court 3</td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-semibold">Audited</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-500">1 hour ago</td>
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Club Accountant</td>
                        <td className="px-3 py-2">Platform Subscription Invoice Payment</td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-semibold">Razorpay Verified</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#D9E6F5]">
              <button
                onClick={() => setIsComplianceModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1565D8] hover:bg-[#0E5BD8] transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
