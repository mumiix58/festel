import { config } from './config';
import { showToast } from './toast';
import { isAuthenticated, refreshToken, logoutUser } from './auth';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');
const isDevelopment = import.meta.env.DEV;

// Add retry functionality with exponential backoff
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'x-retry-count': String(i)
        }
      });
      
      clearTimeout(timeoutId);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const newOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          };
          return await fetch(url, newOptions);
        } else {
          if (isAdminRoute()) {
            logoutUser();
          }
          throw new Error('Authentication required');
        }
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Don't retry if we aborted or if it's an auth error
      if (error.name === 'AbortError' || error.message === 'Authentication required') {
        throw error;
      }
      
      // Only retry if we have attempts left
      if (i === retries - 1) break;
      
      // Wait with exponential backoff before retrying
      await wait(backoff * Math.pow(2, i));
      
      console.log(`Retrying request (${i + 1}/${retries})`);
    }
  }
  
  throw lastError;
};

const api = {
  baseUrl: '/api',

  getAuthHeaders(options?: RequestInit) {
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
        console.log(`Making GET request to: ${api.baseUrl}${url}`);
      }

      const response = await fetchWithRetry(`${api.baseUrl}${url}`, {
        method: 'GET',
        headers: api.getAuthHeaders(),
        credentials: 'include'
      }, 3, 1000);

      const data = await api.handleResponse(response);
      
      if (isDevelopment) {
        console.log(`GET response for ${url}:`, data);
      }

      return data;
    } catch (error) {
      if (isDevelopment) {
        console.error('API GET error:', error);
      }
      // Return null instead of throwing for GET requests
      return null;
    }
  },

  async post(url: string, data: any) {
    try {
      if (isDevelopment) {
        console.log(`Making POST request to: ${api.baseUrl}${url}`, data);
      }

      const isFormData = data instanceof FormData;
      const options: RequestInit = {
        method: 'POST',
        headers: api.getAuthHeaders({ body: data }),
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data)
      };

      const response = await fetchWithRetry(`${api.baseUrl}${url}`, options, 3, 2000);

      const result = await api.handleResponse(response);
      
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
        console.log(`Making PUT request to: ${api.baseUrl}${url}`, data);
      }

      const isFormData = data instanceof FormData;
      const options: RequestInit = {
        method: 'PUT',
        headers: api.getAuthHeaders({ body: data }),
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data)
      };

      const response = await fetchWithRetry(`${api.baseUrl}${url}`, options, 3, 2000);

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
      throw error;
    }
  },

  async delete(url: string) {
    try {
      const response = await fetchWithRetry(`${api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: api.getAuthHeaders(),
        credentials: 'include'
      }, 3, 1000);

      return api.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API DELETE error:', error);
      }
      throw error;
    }
  },

  async patch(url: string, data: any) {
    try {
      const response = await fetchWithRetry(`${api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: api.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      }, 3, 1000);

      return api.handleResponse(response);
    } catch (error) {
      if (isDevelopment) {
        console.error('API PATCH error:', error);
      }
      throw error;
    }
  }
};

export default api;