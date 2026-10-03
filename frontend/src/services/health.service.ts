import api from './api';

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
}

export const healthService = {
  checkHealth() {
    return api.get<HealthStatus>('/health');
  },
};
