export type SystemRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'CLUB_OWNER' | 'STAFF' | 'MEMBER';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  systemRole: SystemRole;
  tenantId: string | null;
  tenantName: string;
  roleId: string | null;
  roleName: string;
  targetModule?: string | null;
  tier: 'Gold' | 'Silver' | 'Junior' | null;
  age?: number | null;
  membershipPlan?: string | null;
  permissions: string[];

   /* ---- 7-day trial ---- */
  trialStartedAt: string | null;
  trialEndsAt:    string | null;
  trialUsed:      boolean;
  trialActive:    boolean;
  trialDaysLeft:  number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Permission {
  permission_id: string;
  module: string;
  action: string;
  description: string;
}

export interface Department {
  department_id: string;
  tenant_id: string;
  name: string;
  description?: string;
}

export interface DynamicRole {
  role_id: string;
  tenant_id: string;
  department_id?: string | null;
  name: string;
  description?: string;
  is_active: boolean;
  permissions: string[];
}
