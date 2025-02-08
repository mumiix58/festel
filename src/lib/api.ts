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
    if (response.status === 404) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      const error = isJson 
        ? await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }))
        : { message: `HTTP error! status: ${response.status}` };
      throw new Error(error.message || 'Network response was not ok');
    }

    if (!isJson) {
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

      return await api.handleResponse(response);
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
      if (isDevelopment) {
        console.log(`Making DELETE request to: ${api.baseUrl}${url}`);
      }

      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: api.getAuthHeaders(),
        credentials: 'include'
      });

      const result = await api.handleResponse(response);
      
      if (isAdminRoute()) {
        showToast.success('Successfully deleted');
      }
      
      return result;
    } catch (error) {
      if (isDevelopment) {
        console.error('API DELETE error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to delete data');
      }
      throw error;
    }
  },

  patch: async (url: string, data: any) => {
    try {
      if (isDevelopment) {
        console.log(`Making PATCH request to: ${api.baseUrl}${url}`, data);
      }

      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: api.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await api.handleResponse(response);
      
      if (isAdminRoute()) {
        showToast.success('Successfully updated');
      }
      
      return result;
    } catch (error) {
      if (isDevelopment) {
        console.error('API PATCH error:', error);
      }
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to update data');
      }
      throw error;
    }
  }
};

export default api;