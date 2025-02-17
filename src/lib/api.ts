import { config } from './config';
import { showToast } from './toast';
import { isAuthenticated, refreshToken, logoutUser } from './auth';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');
const isDevelopment = import.meta.env.DEV;

const api = {
  baseUrl: '/api',

  getAuthHeaders(options?: RequestInit): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
    
    // Only add Content-Type for non-FormData requests
    if (!(options?.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add auth token for admin routes or if authenticated
    if (isAdminRoute() || isAuthenticated()) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  },

  async handleResponse(response: Response) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed && isAdminRoute()) {
        logoutUser();
      }
      throw new Error('Authentication required');
    }

    // Return null for 404s instead of throwing
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const error = await response.json();
        errorMessage = error.message || `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    const data = await response.json();
    return data?.content || data;
  },

  async get(url: string) {
    try {
      if (isDevelopment) {
        console.log(`Making GET request to: ${this.baseUrl}${url}`);
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      const data = await this.handleResponse(response);
      
      if (isDevelopment) {
        console.log(`GET response for ${url}:`, data);
      }

      return data;
    } catch (error) {
      if (isDevelopment) {
        console.error('API GET error:', error);
      }
      return null;
    }
  },

  async post(url: string, data: any) {
    try {
      if (isDevelopment) {
        console.log(`Making POST request to: ${this.baseUrl}${url}`, data);
      }

      const isFormData = data instanceof FormData;
      const options: RequestInit = {
        method: 'POST',
        headers: this.getAuthHeaders({ body: data }),
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data)
      };

      const response = await fetch(`${this.baseUrl}${url}`, options);
      const result = await this.handleResponse(response);
      
      if (isDevelopment) {
        console.log(`POST response for ${url}:`, result);
      }

      if (isAdminRoute()) {
        showToast.success('Successfully saved');
      }
      
      return result;
    } catch (error) {
      if (isDevelopment) {
        console.error('API POST error:', error);
      }
      throw error;
    }
  },

  async put(url: string, data: any) {
    try {
      if (isDevelopment) {
        console.log(`Making PUT request to: ${this.baseUrl}${url}`, data);
      }

      const isFormData = data instanceof FormData;
      const options: RequestInit = {
        method: 'PUT',
        headers: this.getAuthHeaders({ body: data }),
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data)
      };

      const response = await fetch(`${this.baseUrl}${url}`, options);
      const result = await this.handleResponse(response);
      
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
      throw error;
    }
  },

  async delete(url: string) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      return this.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API DELETE error:', error);
      }
      throw error;
    }
  },

  async patch(url: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });

      return this.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API PATCH error:', error);
      }
      throw error;
    }
  }
};

export default api;