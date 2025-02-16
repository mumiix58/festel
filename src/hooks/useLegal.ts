import { useState, useEffect } from 'react';
import { LegalContent } from '@/types';
import { getLegalContent, updateLegalContent } from '@/lib/legal';
import { showToast } from '@/lib/toast';

export function useLegal() {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const legalContent = await getLegalContent();
      setContent(legalContent);
    } catch (err) {
      console.error('Error loading legal content:', err);
      setError('Failed to load legal content');
      showToast.error('Fehler beim Laden der rechtlichen Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: LegalContent): Promise<boolean> => {
    try {
      setError(null);
      await updateLegalContent(newContent);
      setContent(newContent);
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
    content,
    loading,
    error,
    updateContent,
    reloadContent: loadContent
  };
}