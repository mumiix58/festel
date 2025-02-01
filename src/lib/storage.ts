import { Settings, User } from '@/types';
import { defaultSettings } from './defaults';

const storage = {
  // Settings
  getSettings: (): Settings => {
    try {
      const settingsStr = localStorage.getItem('settings');
      if (settingsStr) {
        return JSON.parse(settingsStr);
      }
      // Save and return default settings if none exist
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      return defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      // Always return default settings on error
      return defaultSettings;
    }
  },

  refreshSettings: async (): Promise<Settings> => {
    try {
      const settings = storage.getSettings();
      return settings;
    } catch (error) {
      console.error('Error refreshing settings:', error);
      return defaultSettings;
    }
  },

  updateSettings: async (settings: Settings): Promise<Settings> => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error updating settings:', error);
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
      // Default admin credentials
      if (email === 'admin@festlmacher.at' && password === 'Muhammed5858') {
        const user = {
          id: '1',
          email: 'admin@festlmacher.at',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { 
        success: false, 
        error: 'Invalid credentials'
      };
    } catch (error: any) {
      localStorage.removeItem('currentUser');
      return { 
        success: false, 
        error: error.message || 'Invalid credentials'
      };
    }
  },

  logoutUser: () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/admin/login';
  }
};

// Initialize storage with default data
const initializeStorage = () => {
  // Initialize settings if not exists
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
  }

  // Initialize analytics data
  if (!localStorage.getItem('pageViews')) {
    localStorage.setItem('pageViews', '0');
  }
  if (!localStorage.getItem('uniqueVisitors')) {
    localStorage.setItem('uniqueVisitors', '0');
  }
  if (!localStorage.getItem('visitorIds')) {
    localStorage.setItem('visitorIds', '[]');
  }
  if (!localStorage.getItem('activities')) {
    localStorage.setItem('activities', '[]');
  }
  if (!localStorage.getItem('contactMessages')) {
    localStorage.setItem('contactMessages', '[]');
  }
};

// Run initialization
initializeStorage();

export default storage;