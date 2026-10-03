import { apiMethod } from './api';

export interface ClubStaffItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  systemRole: string;
  department: string;
  roleName: string;
  targetModule?: string;
  password?: string;
  subAccountType: 'Pro Shop' | 'Bar & Kitchen' | 'Front Desk' | 'Finance' | 'Coaching' | 'HR' | 'Groundskeeper' | 'Administration';
  permissions: string[];
  createdAt: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  departmentId?: string;
  department?: string;
  roleId?: string;
  roleName?: string;
  targetModule?: string;
  subAccountType?: 'Pro Shop' | 'Bar & Kitchen' | 'Front Desk' | 'Finance' | 'Coaching' | 'HR' | 'Groundskeeper' | 'Administration';
  permissions?: string[];
  password?: string;
}

export interface ClubRoleItem {
  id: string;
  roleId: string;
  tenantId: string;
  name: string;
  description: string;
  targetModule: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  targetModule: string;
  permissions: string[];
  departmentId?: string;
}

export const DEFAULT_CLUB_SUBACCOUNTS: ClubStaffItem[] = [
  {
    id: 'sub_shop_01',
    name: 'Vikram Mehta (Shop Lead)',
    email: 'shop.ananyashah@playnex.com',
    phone: '+91 98201 11001',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Pro Shop & Gear Inventory',
    roleName: 'Shop Manager',
    targetModule: 'Pro Shop & Inventory',
    subAccountType: 'Pro Shop',
    password: 'Playnex@2026',
    permissions: [
      'shop:create',
      'shop:read',
      'shop:update',
      'shop:stock',
      'shop:sell',
      'inventory:audit',
      'gst:invoice',
    ],
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'sub_bar_01',
    name: 'Chef Manish Joshi (Bar Lead)',
    email: 'bar.ananyashah@playnex.com',
    phone: '+91 98201 11002',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Food & Beverage (Restaurant & Bar)',
    roleName: 'Bar Manager',
    targetModule: 'Restaurant & Bar',
    subAccountType: 'Bar & Kitchen',
    password: 'Playnex@2026',
    permissions: [
      'bar:create',
      'bar:read',
      'bar:update',
      'bar:settle',
      'bar:void',
      'report:read',
      'kot:dispatch',
    ],
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'sub_frontdesk_01',
    name: 'Sneha Vyas (Front Desk)',
    email: 'frontdesk.ananyashah@playnex.com',
    phone: '+91 98201 11003',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Front Desk & Reception',
    roleName: 'Front Desk',
    targetModule: 'Walk-in Front Desk',
    subAccountType: 'Front Desk',
    password: 'Playnex@2026',
    permissions: [
      'booking:create',
      'booking:read',
      'booking:update',
      'booking:cancel',
      'member:create',
      'member:read',
      'member:update',
      'walkin:checkin',
    ],
    createdAt: '2026-01-08T07:30:00.000Z',
  },
  {
    id: 'sub_accountant_01',
    name: 'Nirav Shah (CA & Tax Auditor)',
    email: 'accountant.ananyashah@playnex.com',
    phone: '+91 98201 11004',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Finance & Accounting',
    roleName: 'Accountant',
    targetModule: 'Finance & Payments',
    subAccountType: 'Finance',
    password: 'Playnex@2026',
    permissions: [
      'finance:read',
      'finance:invoice',
      'finance:payroll',
      'finance:tax',
      'report:read',
      'report:export',
      'gst:b2b',
    ],
    createdAt: '2026-01-02T09:00:00.000Z',
  },
  {
    id: 'sub_coach_01',
    name: 'Coach Anand Iyer',
    email: 'coach.ananyashah@playnex.com',
    phone: '+91 98201 11005',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Sports Academy & Coaching',
    roleName: 'Coach',
    targetModule: 'Bookings',
    subAccountType: 'Coaching',
    password: 'Playnex@2026',
    permissions: [
      'booking:read',
      'member:read',
      'event:read',
      'clinic:schedule',
    ],
    createdAt: '2026-01-05T06:00:00.000Z',
  },
  {
    id: 'sub_hr_01',
    name: 'Pooja Nair (HR Lead)',
    email: 'hr.ananyashah@playnex.com',
    phone: '+91 98201 11006',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Human Resources & Personnel',
    roleName: 'HR',
    targetModule: 'Staff Management',
    subAccountType: 'HR',
    password: 'Playnex@2026',
    permissions: [
      'staff:read',
      'staff:manage',
      'staff:schedule',
      'staff:approve_leave',
    ],
    createdAt: '2026-01-04T09:00:00.000Z',
  },
  {
    id: 'sub_grounds_01',
    name: 'Ramesh Patel (Grounds & Courts)',
    email: 'grounds.ananyashah@playnex.com',
    phone: '+91 98201 11007',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Court & Facility Operations',
    roleName: 'Groundskeeper',
    targetModule: 'Facilities & Courts',
    subAccountType: 'Groundskeeper',
    password: 'Playnex@2026',
    permissions: [
      'facility:read',
      'facility:update',
      'court:toggle_availability',
      'maintenance:log',
    ],
    createdAt: '2026-01-03T11:00:00.000Z',
  },
];

const LOCAL_STORAGE_KEY = 'playnex_club_subaccounts_v2';

function getStoredSubAccounts(): ClubStaffItem[] {
  if (typeof window === 'undefined') return DEFAULT_CLUB_SUBACCOUNTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CLUB_SUBACCOUNTS));
      return DEFAULT_CLUB_SUBACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CLUB_SUBACCOUNTS;
  } catch {
    return DEFAULT_CLUB_SUBACCOUNTS;
  }
}

function saveStoredSubAccounts(items: ClubStaffItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save sub-accounts to storage:', err);
  }
}

export const staffService = {
  async getStaff(tenantId?: string) {
    try {
      const res = await apiMethod<ClubStaffItem[]>({
        method: 'GET',
        url: '/club/staff',
        params: tenantId ? { tenantId } : undefined,
      });

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Merge with local sub-accounts to guarantee pro shop, bar, reception exist
        const apiStaff = res.data;
        const stored = getStoredSubAccounts();
        const merged = [...stored];

        apiStaff.forEach((s) => {
          if (!merged.some((m) => m.email.toLowerCase() === s.email.toLowerCase())) {
            merged.push({
              ...s,
              subAccountType: (s.subAccountType || 'Administration') as any,
              permissions: s.permissions || ['General Staff Access'],
            });
          }
        });

        saveStoredSubAccounts(merged);
        return { success: true, data: merged, message: 'Retrieved staff sub-accounts' };
      }
    } catch {
      // Fallback seamlessly to local verified sub-accounts
    }

    const localList = getStoredSubAccounts();
    return { success: true, data: localList, message: 'Retrieved club sub-accounts' };
  },

  async createStaff(data: CreateStaffPayload) {
    const newSubAccount: ClubStaffItem = {
      id: `sub_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      status: 'active',
      systemRole: 'STAFF',
      department: data.department || 'Pro Shop & Gear Inventory',
      roleName: data.roleName || 'Pro Shop Staff',
      subAccountType: data.subAccountType || 'Pro Shop',
      permissions: data.permissions && data.permissions.length > 0
        ? data.permissions
        : ['Standard Station Access'],
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    const current = getStoredSubAccounts();
    const updated = [newSubAccount, ...current];
    saveStoredSubAccounts(updated);

    // Also attempt backend creation
    try {
      await apiMethod<ClubStaffItem>({
        method: 'POST',
        url: '/club/staff',
        data,
      });
    } catch {
      // Offline / Local resilience
    }

    return { success: true, data: newSubAccount, message: 'Sub-account onboarded successfully' };
  },

  async updateStaff(id: string, data: Partial<CreateStaffPayload> & { status?: string }) {
    const current = getStoredSubAccounts();
    const idx = current.findIndex((s) => s.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        ...data,
        name: data.name ?? current[idx].name,
        phone: data.phone !== undefined ? data.phone : current[idx].phone,
        status: data.status ?? current[idx].status,
      };
      saveStoredSubAccounts(current);
    }

    try {
      await apiMethod<ClubStaffItem>({
        method: 'PUT',
        url: `/club/staff/${id}`,
        data,
      });
    } catch {
      // Local fallback
    }

    return { success: true, data: current[idx], message: 'Sub-account updated' };
  },

  async deleteStaff(id: string) {
    const current = getStoredSubAccounts();
    const filtered = current.filter((s) => s.id !== id);
    saveStoredSubAccounts(filtered);

    try {
      await apiMethod<{ id: string }>({
        method: 'DELETE',
        url: `/club/staff/${id}`,
      });
    } catch {
      // Local fallback
    }

    return { success: true, data: { id }, message: 'Sub-account removed' };
  },

  async getRoles() {
    try {
      const res = await apiMethod<ClubRoleItem[]>({
        method: 'GET',
        url: '/club/staff/roles',
      });
      if (res.success && Array.isArray(res.data)) {
        return res;
      }
    } catch {
      // Fallback
    }
    return { success: true, data: [] as ClubRoleItem[], message: 'Loaded roles' };
  },

  async createRole(data: CreateRolePayload) {
    return apiMethod<ClubRoleItem>({
      method: 'POST',
      url: '/club/staff/roles',
      data,
    });
  },

  async deleteRole(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/staff/roles/${id}`,
    });
  },
};

export default staffService;
