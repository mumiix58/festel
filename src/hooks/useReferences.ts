import { useState, useEffect } from 'react';
import { ReferencesContent } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useReferences() {
  const [content, setContent] = useState<ReferencesContent | null>(null);
  const [localContent, setLocalContent] = useState<ReferencesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      const referencesContent = await api.get('/content/references');
      setContent(referencesContent);
      setLocalContent(referencesContent);
      setError(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading references content:', err);
      setError('Failed to load references content');
      showToast.error('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const updateContent = (newContent: ReferencesContent) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const saveContent = async (): Promise<boolean> => {
    if (!hasUnsavedChanges || !localContent) return false;

    try {
      await api.put('/content/references', localContent);
      setContent(localContent);
      setHasUnsavedChanges(false);
      showToast.success('Änderungen erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error updating references content:', err);
      setError('Failed to update references content');
      showToast.error('Fehler beim Speichern der Änderungen');
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