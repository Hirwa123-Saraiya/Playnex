import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { ApiResponse } from '../types/api.types';

// Read API base URL from Next.js public environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Base Axios instance configuration
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token if client-side
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standard error formatting
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network communication error';
    
    console.error('[API Communication Error]:', message);
    return Promise.reject(new Error(message));
  }
);

export interface ApiMethodParams extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  method?: Method | string;
  url: string;
  data?: any;
  params?: any;
}

/**
 * Common generic API method to be used by all service files.
 * Handles making requests through Axios and returning typed ApiResponse<T>.
 */
export async function apiMethod<T = any>({
  method = 'GET',
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

/**
 * Reusable helper wrappers around apiMethod
 */
export const api = {
  request: apiMethod,
  get: <T = any>(url: string, params?: any, config?: AxiosRequestConfig) =>
    apiMethod<T>({ method: 'GET', url, params, ...config }),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiMethod<T>({ method: 'POST', url, data, ...config }),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiMethod<T>({ method: 'PUT', url, data, ...config }),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiMethod<T>({ method: 'PATCH', url, data, ...config }),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiMethod<T>({ method: 'DELETE', url, ...config }),
};

export default apiMethod;
