import { useState, useEffect } from 'react';
import { ReferencesContent } from '@/types';
import { getReferencesContent, updateReferencesContent } from '@/lib/references';

export function useReferences() {
  const [content, setContent] = useState<ReferencesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const referencesContent = await getReferencesContent();
      setContent(referencesContent);
      setError(null);
    } catch (err) {
      console.error('Error loading references content:', err);
      setError('Failed to load references content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: ReferencesContent) => {
    try {
      await updateReferencesContent(newContent);
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating references content:', err);
      setError('Failed to update references content');
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