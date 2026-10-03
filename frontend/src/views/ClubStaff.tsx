'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useClub } from '../context/ClubContext';
import { staffService, ClubStaffItem, CreateStaffPayload } from '../services/staff.service';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Shield,
  Loader2,
  Trash2,
  X,
  Info,
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Trophy,
  IndianRupee,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const SUBACCOUNT_CONFIGS = [
  {
    roleName: 'Pro Shop Manager',
    subAccountType: 'Pro Shop' as const,
    department: 'Pro Shop & Gear Inventory',
    icon: ShoppingBag,
    targetNav: 'Pro Shop & Inventory',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Manages gear stock, POs, emergency stringing requests, and inventory flows',
    defaultPermissions: [
      'Central Inventory Management',
      'POS Counter Billing',
      'Supplier Purchase Orders',
      'Emergency Stringing Requests',
      'Low Stock Reorders',
    ],
  },
  {
    roleName: 'Pro Shop POS Cashier',
    subAccountType: 'Pro Shop' as const,
    department: 'Pro Shop & Gear Inventory',
    icon: ShoppingBag,
    targetNav: 'Pro Shop & Inventory',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Front-counter barcode checkout, member discount verification, returns',
    defaultPermissions: [
      'POS Counter Billing & Barcode Scan',
      'Member Discount Verification',
      'Intake of Returns',
      'Club Pickup Handoff',
    ],
  },
  {
    roleName: 'Bar & Restaurant POS Operator',
    subAccountType: 'Bar & Kitchen' as const,
    department: 'Food & Beverage (Restaurant & Bar)',
    icon: UtensilsCrossed,
    targetNav: 'Restaurant & Bar',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Punches table orders, handles running tabs, applies member food discounts',
    defaultPermissions: [
      'Table Billing & Punch Orders',
      'Member Tab Settlement',
      'Card / UPI / Cash Payments',
      'Closing Shift Reconciliations',
    ],
  },
  {
    roleName: 'Kitchen Head & Chef',
    subAccountType: 'Bar & Kitchen' as const,
    department: 'Food & Beverage (Restaurant & Bar)',
    icon: UtensilsCrossed,
    targetNav: 'Restaurant & Bar',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Receives kitchen order tickets (KOT) on kitchen display, manages menu recipes',
    defaultPermissions: [
      'Kitchen Order Tickets (KOT)',
      'Menu Recipe Management',
      'Raw Material Inventory',
      'Kitchen Display System (KDS)',
    ],
  },
  {
    roleName: 'Front Desk & Walk-in Receptionist',
    subAccountType: 'Front Desk' as const,
    department: 'Front Desk & Reception',
    icon: CalendarDays,
    targetNav: 'Walk-in Front Desk',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Checks in members, books walk-ins, enforces daily 2-hour limits, takes trial inquiries',
    defaultPermissions: [
      'Walk-in Court Slot Booking',
      'Member Check-in & RFID Issuance',
      'Telephone Booking Inquiries',
      'Visitor Trial Session Intake',
    ],
  },
  {
    roleName: 'Head Sports Coach',
    subAccountType: 'Coaching' as const,
    department: 'Sports Academy & Coaching',
    icon: Trophy,
    targetNav: 'Bookings',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Coordinates training clinics, junior academy sessions, and weekend matches',
    defaultPermissions: [
      'Court Training Clinics',
      'Junior Academy Drills',
      'Private Coaching Sessions',
      'Weekend Tournaments',
    ],
  },
  {
    roleName: 'Club Accountant & Auditor',
    subAccountType: 'Finance' as const,
    department: 'Finance & Accounting',
    icon: IndianRupee,
    targetNav: 'Finance & Payments',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Membership subscriptions, corporate invoicing, payroll, and GST reporting',
    defaultPermissions: [
      'Membership Invoicing',
      'Corporate Accounts & B2B Billing',
      'Staff Payroll & Leave Approvals',
      'P&L Statements & GST Compliance',
    ],
  },
];

export const ClubStaff: React.FC = () => {
  const { selectedBranch, setActiveNav } = useClub();
  const [staff, setStaff] = useState<ClubStaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedConfigIdx, setSelectedConfigIdx] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('stationPass2026');

  const currentConfig = SUBACCOUNT_CONFIGS[selectedConfigIdx];

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffService.getStaff();
      if (res.success && Array.isArray(res.data)) {
        setStaff(res.data);
      } else {
        setStaff([]);
      }
    } catch (err) {
      console.error('Error loading sub-accounts:', err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateStaffPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        department: currentConfig.department,
        roleName: currentConfig.roleName,
        subAccountType: currentConfig.subAccountType,
        permissions: currentConfig.defaultPermissions,
        password,
      };

      const res = await staffService.createStaff(payload);
      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        await fetchStaff();
      } else {
        setError(res.message || 'Failed to add sub-account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to onboard sub-account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this sub-account?')) return;
    try {
      await staffService.deleteStaff(id);
      await fetchStaff();
    } catch (err) {
      console.error('Failed to remove sub-account:', err);
    }
  };

  const categories = useMemo(() => {
    return [
      { id: 'All', label: 'All Sub-Accounts', count: staff.length },
      { id: 'Pro Shop', label: '🛍️ Pro Shop', count: staff.filter((s) => s.subAccountType === 'Pro Shop').length },
      { id: 'Bar & Kitchen', label: '🍹 Bar & Kitchen', count: staff.filter((s) => s.subAccountType === 'Bar & Kitchen').length },
      { id: 'Front Desk', label: '🎾 Front Desk', count: staff.filter((s) => s.subAccountType === 'Front Desk').length },
      { id: 'Coaching', label: '🏆 Coaches', count: staff.filter((s) => s.subAccountType === 'Coaching').length },
      { id: 'Finance', label: '💰 Finance & Accounts', count: staff.filter((s) => s.subAccountType === 'Finance').length },
    ];
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || s.subAccountType === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [staff, searchTerm, selectedCategory]);

  const handleLaunchWorkspace = (sub: ClubStaffItem) => {
    const config = SUBACCOUNT_CONFIGS.find(
      (c) => c.roleName.toLowerCase() === sub.roleName.toLowerCase() || c.subAccountType === sub.subAccountType
    );
    if (config?.targetNav) {
      setActiveNav(config.targetNav);
    } else {
      setActiveNav('Dashboard');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
            Club Sub-Accounts & Personnel
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage departmental user sub-accounts for Pro Shop, Bar & Kitchen POS, Front Desk, Coaches, and Finance.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Onboard Sub-Account
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1565D8] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">{staff.length}</div>
            <div className="text-[11px] text-[#64748B] font-medium">Active Sub-Accounts</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">
              {staff.filter((s) => s.subAccountType === 'Pro Shop').length}
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Pro Shop Crew</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">
              {staff.filter((s) => s.subAccountType === 'Bar & Kitchen').length}
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Bar & Kitchen POS</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1565D8] flex items-center justify-center font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">
              {staff.filter((s) => s.subAccountType === 'Front Desk').length}
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Front Desk & Courts</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1565D8] text-white shadow-sm'
                  : 'bg-slate-50 text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sub-account name, email, role..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#D9E6F5] text-xs outline-none focus:border-[#1565D8] bg-[#F7FAFC]"
          />
        </div>
      </div>

      {/* Personnel Table */}
      <div className="bg-white rounded-2xl border border-[#D9E6F5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="animate-spin text-[#1565D8]" size={28} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1E293B]">
              <thead className="bg-[#F7FAFC] border-b border-[#D9E6F5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Sub-Account User</th>
                  <th className="px-4 py-3.5">Station & Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Allowed Modules</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Station Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E6F5]/60">
                {filteredStaff.map((s) => {
                  const config = SUBACCOUNT_CONFIGS.find(
                    (c) => c.roleName.toLowerCase() === s.roleName.toLowerCase() || c.subAccountType === s.subAccountType
                  );

                  return (
                    <tr key={s.id} className="hover:bg-[#F7FAFC]/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#1565D8] border border-[#D9E6F5] font-extrabold flex items-center justify-center text-xs">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#0B1F4D] text-xs">{s.name}</div>
                            <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                              <span>{s.email}</span>
                              {s.phone && (
                                <>
                                  <span>·</span>
                                  <span>{s.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            config?.badgeClass || 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {config?.icon && <config.icon className="w-3 h-3" />}
                          {s.roleName}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[#64748B] font-medium">{s.department}</td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.permissions && s.permissions.slice(0, 2).map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[#1E293B] text-[10px]">
                              {p}
                            </span>
                          ))}
                          {s.permissions && s.permissions.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[#64748B] text-[10px]">
                              +{s.permissions.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleLaunchWorkspace(s)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF3FF] text-[#1565D8] hover:bg-[#1565D8] hover:text-white transition-colors text-[11px] font-bold"
                            title="Launch sub-account workspace"
                          >
                            <span>Launch</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleDeleteStaff(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Remove sub-account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#64748B]">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-[#0B1F4D]">No sub-accounts found</p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Click &quot;Onboard Sub-Account&quot; to configure a Pro Shop, Bar, or Reception station.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Sub-Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4D]">Onboard Departmental Sub-Account</h3>
                <p className="text-xs text-[#64748B]">Configure login credentials and workstation roles for this club</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              {/* Select Sub-Account Role */}
              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">Station & Sub-Account Role</label>
                <select
                  value={selectedConfigIdx}
                  onChange={(e) => setSelectedConfigIdx(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 text-xs outline-none focus:border-[#1565D8] bg-[#F7FAFC] font-semibold text-[#0B1F4D]"
                >
                  {SUBACCOUNT_CONFIGS.map((c, i) => (
                    <option key={c.roleName} value={i}>
                      {c.roleName} ({c.subAccountType})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#64748B] mt-1">{currentConfig.description}</p>
              </div>

              {/* Department & Permissions Preview */}
              <div className="p-3 rounded-xl bg-[#EAF3FF]/60 border border-[#D9E6F5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0B1F4D]">Assigned Department:</span>
                  <span className="text-[11px] font-semibold text-[#1565D8]">{currentConfig.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Granted Module Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentConfig.defaultPermissions.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-[#D9E6F5] text-[10px] text-[#1E293B] font-medium">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personnel Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1E293B] mb-1">Full Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Mehta"
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1">Work / Terminal Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. proshop@championsclub.com"
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1E293B] mb-1">Contact Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 22334"
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1">Terminal Login Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9E6F5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1565D8] hover:bg-[#0E5BD8] disabled:opacity-50 shadow-md shadow-blue-900/20"
                >
                  {submitting ? 'Creating Sub-Account...' : 'Authorize & Create Sub-Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
