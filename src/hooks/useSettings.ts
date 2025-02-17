import { useState, useEffect } from 'react';
import { Settings } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentSettings = await api.get('/settings');
      setSettings(currentSettings);
      setLocalSettings(currentSettings);
      setError(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
      showToast.error('Fehler beim Laden der Einstellungen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setLocalSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const saveSettings = async (logoFile?: File): Promise<boolean> => {
    if (!hasUnsavedChanges && !logoFile) return false;
    if (!localSettings) return false;

    try {
      let formData: FormData | null = null;
      
      if (logoFile) {
        formData = new FormData();
        formData.append('logo', logoFile);
        
        // Add all other settings
        Object.entries(localSettings).forEach(([key, value]) => {
          if (key !== 'logo') {
            formData!.append(key, JSON.stringify(value));
          }
        });
      }

      await api.put('/settings', formData || localSettings);
      setSettings(localSettings);
      setHasUnsavedChanges(false);
      showToast.success('Einstellungen erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      showToast.error('Fehler beim Speichern der Einstellungen');
      return false;
    }
  };

  return {
    settings: localSettings,
    loading,
    error,
    hasUnsavedChanges,
    updateSettings,
    saveSettings,
    reloadSettings: loadSettings
  };
}