import { useState, useEffect } from 'react';
import { FooterContent } from '@/types';
import { getFooterContent, updateFooterContent } from '@/lib/footer';

export function useFooter() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const footerContent = await getFooterContent();
      setContent(footerContent);
    } catch (err) {
      console.error('Error loading footer content:', err);
      setError('Failed to load footer content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: FooterContent): Promise<boolean> => {
    try {
      setError(null);
      await updateFooterContent(newContent);
      setContent(newContent);
      return true;
    } catch (err) {
      console.error('Error updating footer content:', err);
      setError('Failed to update footer content');
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