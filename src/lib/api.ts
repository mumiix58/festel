import axios from 'axios';
import { showToast } from './toast';
import { isAuthenticated, refreshToken, logoutUser } from './auth';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');
const isDevelopment = import.meta.env.DEV;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000, // 2 minutes
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    if (isAdminRoute() || isAuthenticated()) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(7);

    if (isDevelopment) {
      console.log(`[${config.headers['X-Request-ID']}] Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`[${response.config.headers['X-Request-ID']}] Response:`, response.data);
    }
    return response.data?.content || response.data;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
        return axiosInstance(originalRequest);
      } else if (isAdminRoute()) {
        logoutUser();
      }
    }

    // Log error details
    console.error('API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Show error toast in admin routes
    if (isAdminRoute()) {
      showToast.error(error.response?.data?.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

const api = {
  async get<T = any>(url: string) {
    try {
      return await axiosInstance.get<T, T>(url);
    } catch (error) {
      if (isDevelopment) {
        console.error('API GET error:', error);
      }
      return null;
    }
  },

  async post<T = any>(url: string, data: unknown) {
    try {
      const response = await axiosInstance.post<T, T>(url, data);
      if (isAdminRoute()) {
        showToast.success('Successfully saved');
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async put<T = any>(url: string, data: unknown) {
    try {
      const response = await axiosInstance.put<T, T>(url, data);
      if (isAdminRoute()) {
        showToast.success('Successfully saved');
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async patch<T = any>(url: string, data: unknown) {
    return axiosInstance.patch<T, T>(url, data);
  },

  async delete<T = any>(url: string) {
    try {
      return await axiosInstance.delete<T, T>(url);
    } catch (error) {
      throw error;
    }
  }
};

export default api;