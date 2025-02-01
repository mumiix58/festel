import { useState, useEffect } from 'react';
import { getPageContent, updatePageContent } from '@/lib/api/content';

export function useContent(pageId: string) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getPageContent(pageId);
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: any) => {
    try {
      const updatedContent = await updatePageContent(pageId, newContent);
      setContent(updatedContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content');
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