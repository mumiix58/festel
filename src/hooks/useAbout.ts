import { useState, useEffect } from 'react';
import { AboutContent } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [localContent, setLocalContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      const aboutContent = await api.get('/content/about');
      setContent(aboutContent);
      setLocalContent(aboutContent);
      setError(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading about content:', err);
      setError('Failed to load about content');
      showToast.error('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const updateContent = (newContent: AboutContent) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const saveContent = async (): Promise<boolean> => {
    if (!hasUnsavedChanges || !localContent) return false;

    try {
      await api.put('/content/about', localContent);
      setContent(localContent);
      setHasUnsavedChanges(false);
      showToast.success('Änderungen erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error updating about content:', err);
      setError('Failed to update about content');
      showToast.error('Fehler beim Aktualisieren der Inhalte');
      return false;
    }
  };

  return {
    content: localContent,
    loading,
    error,
    hasUnsavedChanges,
    updateContent,
    saveContent,
    reloadContent: loadContent
  };
}