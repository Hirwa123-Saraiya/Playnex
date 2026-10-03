import { apiMethod } from './api';

export interface FacilityItem {
  id: string;
  name: string;
  type: string;
  hourlyRate: number | string;
  surface: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  department?: string;
}

export interface CreateFacilityPayload {
  name: string;
  type: string;
  hourlyRate?: number;
  surface?: string;
  openTime?: string;
  closeTime?: string;
  departmentId?: string;
}

export const facilitiesService = {
  async getFacilities(tenantId?: string) {
    return apiMethod<FacilityItem[]>({
      method: 'GET',
      url: '/club/facilities',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createFacility(data: CreateFacilityPayload) {
    return apiMethod<FacilityItem>({
      method: 'POST',
      url: '/club/facilities',
      data,
    });
  },

  async updateFacility(id: string, data: Partial<CreateFacilityPayload> & { isActive?: boolean }) {
    return apiMethod<FacilityItem>({
      method: 'PUT',
      url: `/club/facilities/${id}`,
      data,
    });
  },

  async deleteFacility(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/facilities/${id}`,
    });
  },
};

export default facilitiesService;
