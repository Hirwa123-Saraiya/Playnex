import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base URL from Next.js public environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Separate Axios Instance with Cookie support enabled
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true, // Enables cookie storage (accessToken & refreshToken)
});

// Request Interceptor: Attach Bearer token from localStorage as fallback for cookies
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/refresh') ||
      config.url?.includes('/auth/register');

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '' && !isAuthEndpoint) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token.trim()}`);
      } else if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token.trim()}`;
      }
    }
  }
  return config;
});

// Response Interceptor: Standard error formatting and automatic token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/register');

    // Auto-refresh token if 401 received, not already retrying, and not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const storedRefreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refreshToken')
          : null;

      // If no stored refresh token, reject immediately
      if (!storedRefreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (newToken && originalRequest.headers) {
              if (typeof originalRequest.headers.set === 'function') {
                originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
              } else {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              }
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Direct unintercepted call to avoid sending expired access token in Authorization header
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-refresh-token': storedRefreshToken,
            },
            withCredentials: true,
          }
        );

        const newAccess = refreshRes.data?.data?.accessToken;
        const newRefresh = refreshRes.data?.data?.refreshToken;

        if (typeof window !== 'undefined') {
          if (newAccess) localStorage.setItem('accessToken', newAccess);
          if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        }

        if (newAccess && originalRequest.headers) {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newAccess}`);
          } else {
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          }
        }

        processQueue(null, newAccess);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Network communication error';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
