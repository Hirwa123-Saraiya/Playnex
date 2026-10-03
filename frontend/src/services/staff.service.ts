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
  createdAt: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  departmentId?: string;
  roleId?: string;
  password?: string;
}

export const staffService = {
  async getStaff(tenantId?: string) {
    return apiMethod<ClubStaffItem[]>({
      method: 'GET',
      url: '/club/staff',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createStaff(data: CreateStaffPayload) {
    return apiMethod<ClubStaffItem>({
      method: 'POST',
      url: '/club/staff',
      data,
    });
  },

  async updateStaff(id: string, data: Partial<CreateStaffPayload> & { status?: string }) {
    return apiMethod<ClubStaffItem>({
      method: 'PUT',
      url: `/club/staff/${id}`,
      data,
    });
  },

  async deleteStaff(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/staff/${id}`,
    });
  },
};

export default staffService;
