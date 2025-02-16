import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useContent(pageId: string) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/content/${pageId}`);
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const updateContent = async (newContent: any) => {
    try {
      await api.put(`/content/${pageId}`, newContent);
      await loadContent(); // Reload to ensure sync
      showToast.success('Content saved successfully');
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content');
      return false;
    }
  };

  const updateSection = async (section: string, sectionContent: any) => {
    try {
      await api.put(`/content/${pageId}/${section}`, sectionContent);
      await loadContent(); // Reload to ensure sync
      showToast.success(`${section} saved successfully`);
      return true;
    } catch (err) {
      console.error('Error updating section:', err);
      setError(`Failed to update ${section}`);
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    updateContent,
    updateSection,
    reloadContent: loadContent
  };
}