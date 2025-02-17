import { useState, useEffect } from 'react';
import { FooterContent } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useFooter() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [localContent, setLocalContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const footerContent = await api.get('/content/footer');
      setContent(footerContent);
      setLocalContent(footerContent);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading footer content:', err);
      setError('Failed to load footer content');
      showToast.error('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const updateContent = (newContent: FooterContent) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const saveContent = async (): Promise<boolean> => {
    if (!hasUnsavedChanges || !localContent) return false;

    try {
      await api.put('/content/footer', localContent);
      setContent(localContent);
      setHasUnsavedChanges(false);
      showToast.success('Footer-Inhalte erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error updating footer content:', err);
      setError('Failed to update footer content');
      showToast.error('Fehler beim Speichern der Footer-Inhalte');
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