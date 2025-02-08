import { config } from './config';
import { showToast } from './toast';
import storage from './storage';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');
const isDevelopment = import.meta.env.DEV;

const api = {
  baseUrl: config.apiUrl,

  getAuthHeaders() {
    const user = storage.getCurrentUser();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    };
    
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    
    return headers;
  },

  async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(error.message || 'Network response was not ok');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: expected JSON');
    }

    const data = await response.json();
    return data?.content || data;
  },

  get: async (url: string) => {
    try {
      if (isDevelopment) {
        console.log(`Making GET request to: ${api.baseUrl}${url}`);
      }

      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'GET',
        headers: api.getAuthHeaders(),
        credentials: 'include'
      });

      const data = await api.handleResponse(response);
      
      if (isDevelopment) {
        console.log(`GET response for ${url}:`, data);
      }

      return data;
    } catch (error) {
      if (isDevelopment) {
        console.error('API GET error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to fetch data');
      }
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      if (isDevelopment) {
        console.log(`Making PUT request to: ${api.baseUrl}${url}`, data);
      }

      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PUT',
        headers: api.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await api.handleResponse(response);
      
      if (isDevelopment) {
        console.log(`PUT response for ${url}:`, result);
      }

      if (isAdminRoute()) {
        showToast.success('Successfully saved');
      }
      
      return result;
    } catch (error) {
      if (isDevelopment) {
        console.error('API PUT error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to save data');
      }
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: api.getAuthHeaders(),
        credentials: 'include'
      });

      return api.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API DELETE error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to delete');
      }
      throw error;
    }
  },

  patch: async (url: string, data: any) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: api.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });

      return api.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API PATCH error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to update');
      }
      throw error;
    }
  }
};

export default api;