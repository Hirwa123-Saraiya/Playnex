import { apiMethod } from './api';

export interface ClubMemberItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tier: string;
  status: string;
  isActive: boolean;
  joinedAt: string;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
  phone?: string;
  tier?: string;
  password?: string;
}

export const membersService = {
  async getMembers(tenantId?: string) {
    return apiMethod<ClubMemberItem[]>({
      method: 'GET',
      url: '/club/members',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createMember(data: CreateMemberPayload) {
    return apiMethod<ClubMemberItem>({
      method: 'POST',
      url: '/club/members',
      data,
    });
  },

  async updateMember(id: string, data: Partial<CreateMemberPayload> & { status?: string }) {
    return apiMethod<ClubMemberItem>({
      method: 'PUT',
      url: `/club/members/${id}`,
      data,
    });
  },

  async deleteMember(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/members/${id}`,
    });
  },
};

export default membersService;
