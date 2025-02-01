import { useState, useEffect } from 'react';
import { LegalContent } from '@/types';
import { getLegalContent, updateLegalContent } from '@/lib/legal';

export function useLegal() {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const legalContent = await getLegalContent();
      setContent(legalContent);
      setError(null);
    } catch (err) {
      console.error('Error loading legal content:', err);
      setError('Failed to load legal content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: LegalContent) => {
    try {
      await updateLegalContent(newContent);
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating legal content:', err);
      setError('Failed to update legal content');
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