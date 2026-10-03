import { AxiosRequestConfig, Method } from 'axios';
import { axiosInstance } from './axios';
import { ApiResponse } from '../types/api.types';

export interface ApiMethodParams extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  method: Method | string;
  url: string;
  data?: any;
  params?: any;
}

/**
 * Generic apiMethod function called by service files
 */
export async function apiMethod<T = any>({
  method,
  url,
  data,
  params,
  ...config
}: ApiMethodParams): Promise<ApiResponse<T>> {
  const response = await axiosInstance.request<ApiResponse<T>>({
    method,
    url,
    data,
    params,
    ...config,
  });
  return response.data;
}

export default apiMethod;
