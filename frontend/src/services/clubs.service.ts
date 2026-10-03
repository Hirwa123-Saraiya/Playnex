import { apiMethod } from './api';

export interface CreateClubPayload {
  clubName: string;
  subdomain?: string;
  sport: string;
  location: string;
  address?: string;
  subscriptionPlan?: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone?: string;
}

export interface ClubItem {
  id: string;
  name: string;
  sport: string;
  location: string;
  status: 'Active' | 'Pending' | 'Suspended';
  subscriptionPlan: string;
  subdomain: string;
  admin: string;
  adminEmail: string;
  members: number;
  bookingsToday: number;
  revenue: number;
}

export interface PlatformStats {
  total_clubs: number;
  total_members: number;
  total_admins?: number;
  today_bookings: number;
  today_revenue: string | number;
  active_facilities: number;
  total_facilities: number;
}

export interface AdminItem {
  id: string;
  name: string;
  email: string;
  club: string;
  role: 'Owner' | 'Manager' | 'Staff';
  status: 'Active' | 'Invited' | 'Disabled';
  lastLogin: string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  club: string;
  plan: 'Trial' | 'Monthly' | 'Annual';
  joined: string;
  active: boolean;
}

export interface ClubRevenueItem {
  id: string;
  club: string;
  subscriptionPlan?: string;
  subdomain?: string;
  platformFee?: number;
  month: number;
  week: number;
  today: number;
  billingCycle?: string;
  paymentStatus?: string;
  nextInvoice?: string;
  growth: number;
}

export const clubsService = {
  /**
   * Fetch all clubs dynamically from backend database
   */
  async getClubs() {
    return apiMethod<ClubItem[]>({
      method: 'GET',
      url: '/clubs',
    });
  },

  /**
   * Fetch platform-wide dynamic stats for Super Admin
   */
  async getStats() {
    return apiMethod<PlatformStats>({
      method: 'GET',
      url: '/clubs/stats',
    });
  },

  /**
   * Fetch all club admins dynamically from database
   */
  async getAdmins() {
    return apiMethod<AdminItem[]>({
      method: 'GET',
      url: '/clubs/admins',
    });
  },

  /**
   * Fetch all end users/members dynamically from database
   */
  async getUsers() {
    return apiMethod<UserItem[]>({
      method: 'GET',
      url: '/clubs/users',
    });
  },

  /**
   * Fetch platform revenue dynamically from database
   */
  async getRevenue() {
    return apiMethod<{ revenueByClub: ClubRevenueItem[] }>({
      method: 'GET',
      url: '/clubs/revenue',
    });
  },

  /**
   * Fetch specific club details by ID
   */
  async getClubById(id: string) {
    return apiMethod<any>({
      method: 'GET',
      url: `/clubs/${id}`,
    });
  },

  /**
   * Update club details in database
   */
  async updateClub(id: string, updates: Partial<CreateClubPayload> & { status?: string }) {
    return apiMethod<any>({
      method: 'PUT',
      url: `/clubs/${id}`,
      data: updates,
    });
  },

  /**
   * Delete club from database
   */
  async deleteClub(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/clubs/${id}`,
    });
  },

  /**
   * Create a new club along with its main admin account directly into the database
   */
  async createClub(payload: CreateClubPayload) {
    return apiMethod<{
      id: string;
      name: string;
      subdomain: string;
      sport: string;
      location: string;
      status: string;
      subscriptionPlan: string;
      admin: {
        userId: string;
        name: string;
        email: string;
        phone: string | null;
        systemRole: string;
        roleName: string;
      };
      createdAt: string;
    }>({
      method: 'POST',
      url: '/clubs',
      data: payload,
    });
  },
};

export default clubsService;
