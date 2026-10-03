import { apiMethod } from './api';

export interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  requester: string;
  details: string;
  amount: number | string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateApprovalPayload {
  type: string;
  title: string;
  requester: string;
  details?: string;
  amount?: number;
}

export const approvalsService = {
  async getApprovals(tenantId?: string) {
    return apiMethod<ApprovalItem[]>({
      method: 'GET',
      url: '/club/approvals',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createApproval(data: CreateApprovalPayload) {
    return apiMethod<ApprovalItem>({
      method: 'POST',
      url: '/club/approvals',
      data,
    });
  },

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    return apiMethod<ApprovalItem>({
      method: 'PUT',
      url: `/club/approvals/${id}`,
      data: { status },
    });
  },
};

export default approvalsService;
