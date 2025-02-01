import { useState, useEffect } from 'react';
import { Settings } from '@/types';
import storage from '@/lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      // Get settings from storage
      const currentSettings = storage.getSettings();
      setSettings(currentSettings);
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings): Promise<Settings> => {
    try {
      const updatedSettings = await storage.updateSettings(newSettings);
      setSettings(updatedSettings);
      setError(null);
      return updatedSettings;
    } catch (err) {
      console.error('Settings update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    reloadSettings: loadSettings
  };
}