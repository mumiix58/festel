import { config } from './config';
import { showToast } from './toast';

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
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await api.handleResponse(response);
      return data;
    } catch (error) {
      console.error('API GET error:', error);
      showToast.error('Failed to fetch data');
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseData = await api.handleResponse(response);
      showToast.success('Successfully saved');
      return responseData;
    } catch (error) {
      console.error('API POST error:', error);
      showToast.error('Failed to save data');
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseData = await api.handleResponse(response);
      showToast.success('Successfully updated');
      return responseData;
    } catch (error) {
      console.error('API PUT error:', error);
      showToast.error('Failed to update data');
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await api.handleResponse(response);
      showToast.success('Successfully deleted');
      return data;
    } catch (error) {
      console.error('API DELETE error:', error);
      showToast.error('Failed to delete data');
      throw error;
    }
  },

  patch: async (url: string, data: any) => {
    try {
      const response = await fetch(`${api.baseUrl}${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseData = await api.handleResponse(response);
      showToast.success('Successfully updated');
      return responseData;
    } catch (error) {
      console.error('API PATCH error:', error);
      showToast.error('Failed to update data');
      throw error;
    }
  }
};

export default api;