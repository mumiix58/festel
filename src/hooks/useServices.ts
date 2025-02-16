import { useState, useEffect } from 'react';
import { ServicesPageContent } from '@/types';
import { getServicesContent, updateServicesContent } from '@/lib/services';
import { showToast } from '@/lib/toast';

export function useServices() {
  const [content, setContent] = useState<ServicesPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const servicesContent = await getServicesContent();
      setContent(servicesContent);
      setError(null);
    } catch (err) {
      console.error('Error loading services content:', err);
      setError('Failed to load services content');
      showToast.error('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: ServicesPageContent): Promise<boolean> => {
    try {
      setError(null);
      const success = await updateServicesContent(newContent);
      if (success) {
        setContent(newContent);
        showToast.success('Änderungen erfolgreich gespeichert');
        return true;
      }
      throw new Error('Failed to update services content');
    } catch (err) {
      console.error('Error updating services content:', err);
      setError('Failed to update services content');
      showToast.error('Fehler beim Speichern der Änderungen');
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    updateContent,
    reloadContent: loadContent
  };
}