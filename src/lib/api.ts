import { config } from './config';

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
      const response = await fetch(`${config.apiUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return api.handleResponse(response);
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      const response = await fetch(`${config.apiUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return api.handleResponse(response);
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const response = await fetch(`${config.apiUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return api.handleResponse(response);
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await fetch(`${config.apiUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      return api.handleResponse(response);
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },

  patch: async (url: string, data: any) => {
    try {
      const response = await fetch(`${config.apiUrl}${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return api.handleResponse(response);
    } catch (error) {
      console.error('API PATCH error:', error);
      throw error;
    }
  }
};

export default api;