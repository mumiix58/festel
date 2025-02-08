import { config } from './config';
import { showToast } from './toast';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');

const api = {
  baseUrl: config.apiUrl,

  handleResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network response was not ok' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  get: async (url: string) => {
    try {
      console.log(`Making GET request to: ${api.baseUrl}${url}`);
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log(`GET response for ${url}:`, data);
      return data;
    } catch (error) {
      console.error('API GET error:', error);
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to fetch data');
      }
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      console.log(`Making POST request to: ${api.baseUrl}${url}`);
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(error.message);
      }

      const responseData = await response.json();
      console.log(`POST response for ${url}:`, responseData);
      
      if (isAdminRoute()) {
        showToast.success('Successfully saved');
      }
      return responseData;
    } catch (error) {
      console.error('API POST error:', error);
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to save data');
      }
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      console.log(`Making PUT request to: ${api.baseUrl}${url}`);
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(error.message);
      }

      const responseData = await response.json();
      console.log(`PUT response for ${url}:`, responseData);
      
      if (isAdminRoute()) {
        showToast.success('Successfully updated');
      }
      return responseData;
    } catch (error) {
      console.error('API PUT error:', error);
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to update data');
      }
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      console.log(`Making DELETE request to: ${api.baseUrl}${url}`);
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log(`DELETE response for ${url}:`, data);
      
      if (isAdminRoute()) {
        showToast.success('Successfully deleted');
      }
      return data;
    } catch (error) {
      console.error('API DELETE error:', error);
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to delete data');
      }
      throw error;
    }
  },

  patch: async (url: string, data: any) => {
    try {
      console.log(`Making PATCH request to: ${api.baseUrl}${url}`);
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(error.message);
      }

      const responseData = await response.json();
      console.log(`PATCH response for ${url}:`, responseData);
      
      if (isAdminRoute()) {
        showToast.success('Successfully updated');
      }
      return responseData;
    } catch (error) {
      console.error('API PATCH error:', error);
      if (isAdminRoute()) {
        showToast.error(error instanceof Error ? error.message : 'Failed to update data');
      }
      throw error;
    }
  }
};

export default api;