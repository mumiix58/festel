import { useState, useEffect } from 'react';
import { getPageContent, updatePageContent } from '@/lib/api/content';

export function useContent(pageId: string) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setSaveMessage(null);
      const data = await getPageContent(pageId);
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load content from database'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: any) => {
    try {
      setSaveMessage(null);
      const response = await updatePageContent(pageId, newContent);
      setContent(response);
      setError(null);
      setSaveMessage({
        type: 'success',
        text: 'Content successfully saved to database'
      });
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content');
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save content to database'
      });
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    saveMessage,
    updateContent,
    reloadContent: loadContent
  };
}