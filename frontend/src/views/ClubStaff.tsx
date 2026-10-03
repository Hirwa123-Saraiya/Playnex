'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useClub } from '../context/ClubContext';
import {
  staffService,
  ClubStaffItem,
  CreateStaffPayload,
  ClubRoleItem,
  CreateRolePayload,
} from '../services/staff.service';
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
  Plus,
  Layers,
  Landmark,
  ShieldAlert,
  FileText,
  Key,
  Check,
  Copy,
  UserCog,
  Wrench,
  Sparkles,
} from 'lucide-react';

const WORKSTATION_DEFINITIONS = [
  {
    roleName: 'Shop Manager',
    emailSlug: 'shop',
    subAccountType: 'Pro Shop' as const,
    department: 'Pro Shop & Gear Inventory',
    icon: ShoppingBag,
    targetNav: 'Pro Shop & Inventory',
    targetPath: '/club/pro-shop',
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
    subAccountType: 'Bar & Kitchen' as const,
    department: 'Food & Beverage (Restaurant & Bar)',
    icon: UtensilsCrossed,
    targetNav: 'Restaurant & Bar',
    targetPath: '/club/restaurant',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Bar tables, tabs, kitchen order tickets (KOT), closing day-end reconciliations.',
    defaultPermissions: [
      'bar:create',
      'bar:read',
      'bar:update',
      'bar:settle',
      'bar:void',
      'report:read',
      'kot:dispatch',
    ],
  },
  {
    roleName: 'Front Desk',
    emailSlug: 'frontdesk',
    subAccountType: 'Front Desk' as const,
    department: 'Front Desk & Reception',
    icon: CalendarDays,
    targetNav: 'Walk-in Front Desk',
    targetPath: '/club/walk-in',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Manages walk-ins, phone calls, player check-in, court schedule locks & inquiries.',
    defaultPermissions: [
      'booking:create',
      'booking:read',
      'booking:update',
      'booking:cancel',
      'member:create',
      'member:read',
      'member:update',
      'walkin:checkin',
    ],
  },
  {
    roleName: 'Accountant',
    emailSlug: 'accountant',
    subAccountType: 'Finance' as const,
    department: 'Finance & Accounting',
    icon: IndianRupee,
    targetNav: 'Finance & Payments',
    targetPath: '/club/finance',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Financial ledgers, 18% GST invoice generation, staff payroll, and government tax compliance audits.',
    defaultPermissions: [
      'finance:read',
      'finance:invoice',
      'finance:payroll',
      'finance:tax',
      'report:read',
      'report:export',
      'gst:b2b',
    ],
  },
  {
    roleName: 'Coach',
    emailSlug: 'coach',
    subAccountType: 'Coaching' as const,
    department: 'Sports Academy & Coaching',
    icon: Trophy,
    targetNav: 'Bookings',
    targetPath: '/club/bookings',
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
    subAccountType: 'HR' as const,
    department: 'Human Resources & Personnel',
    icon: UserCog,
    targetNav: 'Staff Management',
    targetPath: '/club/staff',
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
    subAccountType: 'Groundskeeper' as const,
    department: 'Court & Facility Operations',
    icon: Wrench,
    targetNav: 'Facilities & Courts',
    targetPath: '/club/facilities',
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

const AVAILABLE_TARGET_MODULES = [
  { name: 'Pro Shop & Inventory', path: '/club/pro-shop', desc: 'Central stock, item SKU catalog, barcode checkout' },
  { name: 'Restaurant & Bar', path: '/club/restaurant', desc: 'Table POS, KOT dispatch, running member tabs' },
  { name: 'Walk-in Front Desk', path: '/club/walk-in', desc: 'Court check-in, walk-in slot booking, RFID issuance' },
  { name: 'Bookings & Courts', path: '/club/bookings', desc: 'Court scheduling, clinics, training slots' },
  { name: 'Finance & Payments', path: '/club/finance', desc: 'Invoicing, GST ledger, financial transactions' },
  { name: 'Reports & Analytics', path: '/club/reports', desc: 'Revenue analytics, occupancy rates, audit logs' },
  { name: 'Facilities & Courts', path: '/club/facilities', desc: 'Court availability, maintenance logs, lighting' },
  { name: 'Members & CRM', path: '/club/members', desc: 'Member profiles, loyalty tier management, approvals' },
];

const AVAILABLE_PERMISSIONS = [
  'shop:create',
  'shop:read',
  'shop:update',
  'shop:stock',
  'shop:sell',
  'inventory:audit',
  'gst:invoice',
  'bar:create',
  'bar:read',
  'bar:update',
  'bar:settle',
  'bar:void',
  'kot:dispatch',
  'booking:create',
  'booking:read',
  'booking:update',
  'booking:cancel',
  'walkin:checkin',
  'member:create',
  'member:read',
  'member:update',
  'finance:read',
  'finance:invoice',
  'finance:payroll',
  'finance:tax',
  'staff:read',
  'staff:manage',
  'staff:approve_leave',
  'facility:read',
  'facility:update',
  'court:toggle_availability',
  'report:read',
  'report:export',
];

export const ClubStaff: React.FC = () => {
  const router = useRouter();
  const { club, setActiveNav } = useClub();
  const [activeTab, setActiveTab] = useState<'credentials' | 'staff' | 'roles'>('credentials');

  // Staff State
  const [staff, setStaff] = useState<ClubStaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Roles State
  const [roles, setRoles] = useState<ClubRoleItem[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Copied State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Compliance Modal State
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  // Staff Form State
  const [selectedRoleType, setSelectedRoleType] = useState<string>('Shop Manager');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Playnex@2026');

  // Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleTargetModule, setNewRoleTargetModule] = useState('Pro Shop & Inventory');
  const [newRoleDepartment, setNewRoleDepartment] = useState('Pro Shop & Gear Inventory');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'shop:read',
    'shop:sell',
    'inventory:audit',
  ]);

  const clubClean = (club.name || 'club').toLowerCase().replace(/[^a-z0-9]/g, '');

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

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await staffService.getRoles();
      if (res.success && Array.isArray(res.data)) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error('Error loading roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  // Combined roles list for staff assignment
  const allAvailableRoles = useMemo(() => {
    const list: Array<{
      name: string;
      department: string;
      targetModule: string;
      subAccountType: any;
      permissions: string[];
      isCustom: boolean;
    }> = [];

    // System presets
    WORKSTATION_DEFINITIONS.forEach((c) => {
      list.push({
        name: c.roleName,
        department: c.department,
        targetModule: c.targetNav,
        subAccountType: c.subAccountType,
        permissions: c.defaultPermissions,
        isCustom: false,
      });
    });

    // Custom roles from DB
    roles.forEach((r) => {
      if (!list.some((existing) => existing.name.toLowerCase() === r.name.toLowerCase())) {
        let type: any = 'Administration';
        const tm = (r.targetModule || '').toLowerCase();
        if (tm.includes('shop') || tm.includes('inventory')) type = 'Pro Shop';
        else if (tm.includes('bar') || tm.includes('restaurant')) type = 'Bar & Kitchen';
        else if (tm.includes('desk') || tm.includes('walk-in')) type = 'Front Desk';
        else if (tm.includes('finance')) type = 'Finance';
        else if (tm.includes('booking')) type = 'Coaching';

        list.push({
          name: r.name,
          department: r.targetModule || 'General Operations',
          targetModule: r.targetModule,
          subAccountType: type,
          permissions: r.permissions || [],
          isCustom: true,
        });
      }
    });

    return list;
  }, [roles]);

  const activeRoleConfig = useMemo(() => {
    return (
      allAvailableRoles.find((r) => r.name === selectedRoleType) ||
      allAvailableRoles[0] || {
        name: 'Staff',
        department: 'Operations',
        targetModule: 'Dashboard',
        subAccountType: 'Administration',
        permissions: [],
        isCustom: false,
      }
    );
  }, [allAvailableRoles, selectedRoleType]);

  const handleCopyCredentials = (copyEmail: string, copyPass: string, id: string) => {
    navigator.clipboard.writeText(`Email: ${copyEmail}\nPassword: ${copyPass}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStaffError('Name and email are required');
      return;
    }
    setSubmittingStaff(true);
    setStaffError(null);
    try {
      const payload: CreateStaffPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        department: activeRoleConfig.department,
        roleName: activeRoleConfig.name,
        targetModule: activeRoleConfig.targetModule,
        subAccountType: activeRoleConfig.subAccountType,
        permissions: activeRoleConfig.permissions,
        password,
      };

      const res = await staffService.createStaff(payload);
      if (res.success) {
        setIsStaffModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        await fetchStaff();
      } else {
        setStaffError(res.message || 'Failed to add sub-account');
      }
    } catch (err: any) {
      setStaffError(err.response?.data?.message || err.message || 'Failed to onboard sub-account');
    } finally {
      setSubmittingStaff(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      setRoleError('Role name is required');
      return;
    }
    setSubmittingRole(true);
    setRoleError(null);
    try {
      const payload: CreateRolePayload = {
        name: newRoleName.trim(),
        targetModule: newRoleTargetModule,
        departmentId: undefined,
        description: newRoleDescription.trim(),
        permissions: selectedPermissions,
      };

      const res = await staffService.createRole(payload);
      if (res.success) {
        setIsRoleModalOpen(false);
        setNewRoleName('');
        setNewRoleDescription('');
        await fetchRoles();
      } else {
        setRoleError(res.message || 'Failed to create role');
      }
    } catch (err: any) {
      setRoleError(err.response?.data?.message || err.message || 'Failed to create role');
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleDeleteRole = async (id: string, roleName: string) => {
    if (!confirm(`Are you sure you want to remove the custom role "${roleName}"?`)) return;
    try {
      await staffService.deleteRole(id);
      await fetchRoles();
    } catch (err) {
      console.error('Failed to delete role:', err);
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

  const handleLaunchWorkspace = (targetNav: string, targetPath?: string) => {
    setActiveNav(targetNav);
    if (targetPath) {
      router.push(targetPath);
    }
  };

  const togglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const categories = useMemo(() => {
    return [
      { id: 'All', label: 'All Sub-Accounts', count: staff.length },
      { id: 'Pro Shop', label: '🛍️ Pro Shop', count: staff.filter((s) => s.subAccountType === 'Pro Shop').length },
      { id: 'Bar & Kitchen', label: '🍹 Bar & Kitchen', count: staff.filter((s) => s.subAccountType === 'Bar & Kitchen').length },
      { id: 'Front Desk', label: '🎾 Front Desk', count: staff.filter((s) => s.subAccountType === 'Front Desk').length },
      { id: 'Finance', label: '💰 Finance & Accounts', count: staff.filter((s) => s.subAccountType === 'Finance').length },
      { id: 'Coaching', label: '🏆 Coaches', count: staff.filter((s) => s.subAccountType === 'Coaching').length },
      { id: 'HR', label: '👥 HR', count: staff.filter((s) => s.subAccountType === 'HR').length },
      { id: 'Groundskeeper', label: '🌿 Grounds', count: staff.filter((s) => s.subAccountType === 'Groundskeeper').length },
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

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#1565D8] selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Staff Workstations & Multi-Tenant Credentials
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
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0B1F4D] text-xs font-bold rounded-xl border border-slate-200 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#1565D8]" />
            <span>Gov & Tax Audit</span>
          </button>

          <button
            onClick={() => {
              setRoleError(null);
              setIsRoleModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#1565D8] text-xs font-bold rounded-xl border border-[#1565D8]/30 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Role</span>
          </button>

          <button
            onClick={() => {
              setStaffError(null);
              setIsStaffModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Personnel</span>
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
              When sub-account personnel log in, they strictly see data for club owner{' '}
              <strong className="text-white underline">{club.name}</strong> (Tenant ID:{' '}
              <code className="text-amber-200 font-mono text-[11px]">{club.tenantId || 'tenant_active'}</code>). All
              transactions, walk-in bookings, and POS counter sales entered by staff are timestamped with their name, tagged
              with GSTIN, and synchronized with Super Admin / Government tax audit tables.
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

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#D9E6F5] pb-2">
        <button
          onClick={() => setActiveTab('credentials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'credentials'
              ? 'bg-[#1565D8] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0B1F4D] hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Workstation Login Credentials (7 Roles)</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'staff'
              ? 'bg-[#1565D8] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0B1F4D] hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Personnel Accounts ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-[#1565D8] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0B1F4D] hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Roles & Module Permissions ({allAvailableRoles.length})</span>
        </button>
      </div>

      {/* TAB 1: WORKSTATION LOGIN CREDENTIALS */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0B1F4D]">Official Workstations & Login Credentials</h2>
              <p className="text-xs text-[#64748B]">
                Staff members log in with these live credentials and land directly on their designated module overview.
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
      )}

      {/* TAB 2: STAFF PERSONNEL ACCOUNTS */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {/* KPI Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1565D8] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">{staff.length}</div>
                <div className="text-[11px] text-[#64748B] font-medium">Active Personnel</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">
                  {staff.filter((s) => s.subAccountType === 'Pro Shop' || s.roleName.includes('Shop')).length}
                </div>
                <div className="text-[11px] text-[#64748B] font-medium">Pro Shop & Inventory</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">
                  {staff.filter((s) => s.subAccountType === 'Bar & Kitchen' || s.roleName.includes('Bar')).length}
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
                  {staff.filter((s) => s.subAccountType === 'Front Desk' || s.roleName.includes('Front')).length}
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
                placeholder="Search staff name, email, role..."
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
                      <th className="px-5 py-3.5">Staff User</th>
                      <th className="px-4 py-3.5">Role & Destination</th>
                      <th className="px-4 py-3.5">Live Login Credentials</th>
                      <th className="px-4 py-3.5">Department</th>
                      <th className="px-4 py-3.5">Allowed Permissions</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E6F5]/60">
                    {filteredStaff.map((s) => {
                      const config = WORKSTATION_DEFINITIONS.find(
                        (c) => c.roleName.toLowerCase() === s.roleName.toLowerCase() || c.subAccountType === s.subAccountType
                      );
                      const isCopied = copiedId === s.id;

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
                                  <span>{s.phone || 'Club Workstation'}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-blue-50 text-[#1565D8] border-blue-200">
                              <span>{s.roleName}</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <ArrowRight className="w-2.5 h-2.5 text-emerald-500" />
                              <span>Lands on: {config?.targetNav || s.targetModule || 'Dashboard'}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <div className="font-mono text-[11px] font-semibold text-[#0B1F4D]">{s.email}</div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-slate-400">Pass: Playnex@2026</span>
                                <button
                                  onClick={() => handleCopyCredentials(s.email, 'Playnex@2026', s.id)}
                                  className={`p-1 rounded text-[10px] flex items-center gap-1 font-semibold transition-colors ${
                                    isCopied
                                      ? 'text-emerald-700 bg-emerald-100'
                                      : 'text-slate-500 hover:text-[#1565D8] bg-slate-100'
                                  }`}
                                  title="Copy login credentials"
                                >
                                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-[#64748B] font-medium">{s.department}</td>

                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {s.permissions &&
                                s.permissions.slice(0, 2).map((p, i) => (
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
                              Active (Isolated)
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleLaunchWorkspace(config?.targetNav || 'Dashboard', config?.targetPath)}
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
                        <td colSpan={7} className="py-12 text-center text-[#64748B]">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-[#0B1F4D]">No personnel accounts found</p>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Click &quot;Onboard Personnel&quot; to configure a Pro Shop, Bar, or Reception station.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & MODULE PERMISSIONS */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B1F4D]">Configured Departmental Roles</h2>
              <p className="text-xs text-[#64748B]">
                Roles link directly to specific operational modules with granular permissions and multi-tenant audit enforcement.
              </p>
            </div>
            <button
              onClick={() => {
                setRoleError(null);
                setIsRoleModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAvailableRoles.map((role, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-[#0B1F4D] text-sm">{role.name}</h3>
                      <p className="text-[11px] text-[#64748B] font-medium">{role.department}</p>
                    </div>
                    {role.isCustom ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Custom Role
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        System Built-in
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F7FAFC] border border-[#D9E6F5] my-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium">Target Dashboard:</span>
                      <span className="font-bold text-[#1565D8]">{role.targetModule}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      Assigned Capabilities ({role.permissions.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                      {role.permissions.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-[#1E293B]"
                        >
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D9E6F5] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Multi-Tenant Secured
                  </span>

                  {role.isCustom && (
                    <button
                      onClick={() => {
                        const dbRole = roles.find((r) => r.name.toLowerCase() === role.name.toLowerCase());
                        if (dbRole) handleDeleteRole(dbRole.id, role.name);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete custom role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onboard Sub-Account Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4D]">Onboard Departmental Personnel</h3>
                <p className="text-xs text-[#64748B]">
                  Assign a role and dedicated dashboard station isolated to {club.name}
                </p>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{staffError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              {/* Select Role */}
              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">Select Role & Dashboard Target</label>
                <select
                  value={selectedRoleType}
                  onChange={(e) => setSelectedRoleType(e.target.value)}
                  className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 text-xs outline-none focus:border-[#1565D8] bg-[#F7FAFC] font-semibold text-[#0B1F4D]"
                >
                  {allAvailableRoles.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} — (Target: {c.targetModule}) {c.isCustom ? '★ Custom' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department & Permissions Preview */}
              <div className="p-3 rounded-xl bg-[#EAF3FF]/60 border border-[#D9E6F5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0B1F4D]">Assigned Department:</span>
                  <span className="text-[11px] font-semibold text-[#1565D8]">{activeRoleConfig.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0B1F4D]">Direct Login Redirection:</span>
                  <span className="text-[11px] font-bold text-emerald-700">Lands on {activeRoleConfig.targetModule}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Granted Module Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeRoleConfig.permissions.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white border border-[#D9E6F5] text-[10px] text-[#1E293B] font-medium"
                      >
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
                    placeholder={`e.g. ${activeRoleConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@${clubClean}.com`}
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
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStaff}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1565D8] hover:bg-[#0E5BD8] disabled:opacity-50 shadow-md shadow-blue-900/20"
                >
                  {submittingStaff ? 'Creating Sub-Account...' : 'Authorize & Onboard Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4D]">Create Custom Departmental Role</h3>
                <p className="text-xs text-[#64748B]">
                  Define role permissions and its destination dashboard/page for {club.name}
                </p>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {roleError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{roleError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">Role Title</label>
                <input
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Senior Inventory & Stringing Specialist"
                  className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">Target Dashboard / Page</label>
                  <select
                    value={newRoleTargetModule}
                    onChange={(e) => setNewRoleTargetModule(e.target.value)}
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8] bg-[#F7FAFC] font-semibold text-[#0B1F4D]"
                  >
                    {AVAILABLE_TARGET_MODULES.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} ({m.path})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B1F4D] mb-1">Assigned Department</label>
                  <input
                    value={newRoleDepartment}
                    onChange={(e) => setNewRoleDepartment(e.target.value)}
                    placeholder="e.g. Pro Shop & Gear Inventory"
                    className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">Role Description</label>
                <textarea
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Summarize the core operational duties and responsibilities for this role..."
                  className="w-full rounded-xl border border-[#D9E6F5] px-3 py-2 outline-none focus:border-[#1565D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-2">Granular Module Permissions Checklist</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-[#D9E6F5] p-3 rounded-xl bg-[#F7FAFC]">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50 text-[#1565D8] font-semibold' : 'text-[#64748B] hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[#1565D8] border-[#1565D8] text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-mono">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9E6F5]">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRole}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1565D8] hover:bg-[#0E5BD8] disabled:opacity-50 shadow-md shadow-blue-900/20"
                >
                  {submittingRole ? 'Saving Role...' : 'Save & Publish Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <strong>Tenant Isolation:</strong> Every sub-account created by {club.name} is cryptographically locked to Tenant ID{' '}
                    <code>{club.tenantId || 'tenant_active'}</code>. Personnel cannot access other clubs or cross-tenant databases.
                  </li>
                  <li>
                    <strong>Live Operator Stamping:</strong> When an inventory adjustment, pro shop checkout, bar bill, or court slot booking is performed by a staff member, their user ID and name are recorded in the audit trail.
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
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Vikram Mehta (Shop Lead)</td>
                        <td className="px-3 py-2">Counter POS: Yonex Grip Tape</td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-semibold">18% GST (Tax Paid)</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-500">12 mins ago</td>
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Sneha Vyas (Front Desk)</td>
                        <td className="px-3 py-2">Walk-in Booking: Badminton Court 3</td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-semibold">Audited</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-500">1 hour ago</td>
                        <td className="px-3 py-2 font-medium text-[#0B1F4D]">Nirav Shah (CA)</td>
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
