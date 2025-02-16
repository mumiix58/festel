import { Settings, User } from '@/types';
import api from './api';
import { defaultSettings } from './defaults';

const storage = {
  // Settings
  getSettings: async (): Promise<Settings> => {
    try {
      // First try to get from API
      const settings = await api.get('/settings');
      if (settings) {
        return settings;
      }
      // Return default settings if API fails
      return defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      // Return default settings on error
      return defaultSettings;
    }
  },

  refreshSettings: async (): Promise<Settings> => {
    try {
      // First try to get from API
      const settings = await api.get('/settings');
      if (settings) {
        return settings;
      }
      // Return default settings if API fails
      return defaultSettings;
    } catch (error) {
      console.error('Error refreshing settings:', error);
      // Return default settings on error
      return defaultSettings;
    }
  },

  updateSettings: async (settings: Settings): Promise<Settings> => {
    try {
      const updatedSettings = await api.put('/settings', settings);
      if (!updatedSettings) {
        throw new Error('Failed to update settings');
      }
      return updatedSettings;
    } catch (error) {
      console.error('Settings update error:', error);
      throw new Error('Failed to update settings');
    }
  },

  // Auth
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      if (!user.email || !user.role) {
        localStorage.removeItem('currentUser');
        return null;
      }
      return user;
    } catch (error) {
      localStorage.removeItem('currentUser');
      return null;
    }
  },

  authenticateUser: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response?.success && response.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.user.token);
        return { success: true, user: response.user };
      }
      
      return { 
        success: false, 
        error: 'Invalid credentials'
      };
    } catch (error: any) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      return { 
        success: false, 
        error: error.message || 'Invalid credentials'
      };
    }
  },

  logoutUser: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  }
};

export default storage;