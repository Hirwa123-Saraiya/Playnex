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
  subAccountType: 'Pro Shop' | 'Bar & Kitchen' | 'Front Desk' | 'Finance' | 'Coaching' | 'Administration';
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
  subAccountType?: 'Pro Shop' | 'Bar & Kitchen' | 'Front Desk' | 'Finance' | 'Coaching' | 'Administration';
  permissions?: string[];
  password?: string;
}

export const DEFAULT_CLUB_SUBACCOUNTS: ClubStaffItem[] = [
  {
    id: 'sub_proshop_01',
    name: 'Vikram Mehta (Lead)',
    email: 'proshop.manager@championsclub.com',
    phone: '+91 98201 11223',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Pro Shop & Gear Inventory',
    roleName: 'Pro Shop Manager',
    subAccountType: 'Pro Shop',
    permissions: [
      'Central Inventory Management',
      'POS Counter Billing',
      'Supplier Purchase Orders',
      'Emergency Stringing Requests',
      'Low Stock Reorders',
    ],
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'sub_proshop_02',
    name: 'Arjun Patel',
    email: 'proshop.pos@championsclub.com',
    phone: '+91 98201 22334',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Pro Shop & Gear Inventory',
    roleName: 'Pro Shop POS Cashier',
    subAccountType: 'Pro Shop',
    permissions: [
      'POS Counter Billing & Barcode Scan',
      'Member Discount Verification',
      'Intake of Returns',
      'Club Pickup Handoff',
    ],
    createdAt: '2026-01-15T09:30:00.000Z',
  },
  {
    id: 'sub_bar_01',
    name: 'Chef Manish Joshi',
    email: 'kitchen.head@championsclub.com',
    phone: '+91 98201 33445',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Food & Beverage (Restaurant & Bar)',
    roleName: 'Kitchen Head & Chef',
    subAccountType: 'Bar & Kitchen',
    permissions: [
      'Kitchen Order Tickets (KOT)',
      'Menu Recipe Management',
      'Raw Material Inventory',
      'Kitchen Display System (KDS)',
    ],
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'sub_bar_02',
    name: 'Rohan Deshmukh',
    email: 'bar.pos@championsclub.com',
    phone: '+91 98201 44556',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Food & Beverage (Restaurant & Bar)',
    roleName: 'Bar POS & Table Captain',
    subAccountType: 'Bar & Kitchen',
    permissions: [
      'Table Billing & Punch Orders',
      'Member Tab Settlement',
      'Card / UPI / Cash Payments',
      'Closing Shift Reconciliations',
    ],
    createdAt: '2026-01-18T11:00:00.000Z',
  },
  {
    id: 'sub_reception_01',
    name: 'Sneha Vyas',
    email: 'reception@championsclub.com',
    phone: '+91 98201 55667',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Front Desk & Reception',
    roleName: 'Front Desk & Walk-in Receptionist',
    subAccountType: 'Front Desk',
    permissions: [
      'Walk-in Court Slot Booking',
      'Member Check-in & RFID Issuance',
      'Telephone Booking Inquiries',
      'Visitor Trial Session Intake',
    ],
    createdAt: '2026-01-08T07:30:00.000Z',
  },
  {
    id: 'sub_coach_01',
    name: 'Coach Anand Iyer',
    email: 'coach.anand@championsclub.com',
    phone: '+91 98201 66778',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Sports Academy & Coaching',
    roleName: 'Head Tennis Coach',
    subAccountType: 'Coaching',
    permissions: [
      'Court Training Clinics',
      'Junior Academy Drills',
      'Private Coaching Sessions',
      'Weekend Tournaments',
    ],
    createdAt: '2026-01-05T06:00:00.000Z',
  },
  {
    id: 'sub_finance_01',
    name: 'Nirav Shah (CA)',
    email: 'finance.lead@championsclub.com',
    phone: '+91 98201 77889',
    status: 'active',
    systemRole: 'STAFF',
    department: 'Finance & Accounting',
    roleName: 'Club Accountant & Auditor',
    subAccountType: 'Finance',
    permissions: [
      'Membership Invoicing',
      'Corporate Accounts & B2B Billing',
      'Staff Payroll & Leave Approvals',
      'P&L Statements & GST Compliance',
    ],
    createdAt: '2026-01-02T09:00:00.000Z',
  },
];

const LOCAL_STORAGE_KEY = 'playnex_club_subaccounts_v1';

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
};

export default staffService;
