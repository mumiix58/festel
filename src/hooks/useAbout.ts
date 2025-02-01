import { useState, useEffect } from 'react';
import { AboutContent } from '@/types';
import { getAboutContent, updateAboutContent } from '@/lib/about';

export function useAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const aboutContent = await getAboutContent();
      setContent(aboutContent);
      setError(null);
    } catch (err) {
      console.error('Error loading about content:', err);
      setError('Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: AboutContent) => {
    try {
      await updateAboutContent(newContent);
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating about content:', err);
      setError('Failed to update about content');
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