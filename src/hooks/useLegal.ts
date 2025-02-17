import { useState, useEffect } from 'react';
import { LegalContent } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useLegal() {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [localContent, setLocalContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const legalContent = await api.get('/content/legal');
      setContent(legalContent);
      setLocalContent(legalContent);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading legal content:', err);
      setError('Failed to load legal content');
      showToast.error('Fehler beim Laden der rechtlichen Inhalte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const updateContent = (newContent: LegalContent) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const saveContent = async (): Promise<boolean> => {
    if (!hasUnsavedChanges || !localContent) return false;

    try {
      await api.put('/content/legal', localContent);
      setContent(localContent);
      setHasUnsavedChanges(false);
      showToast.success('Rechtliche Inhalte erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error updating legal content:', err);
      setError('Failed to update legal content');
      showToast.error('Fehler beim Speichern der rechtlichen Inhalte');
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