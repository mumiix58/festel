import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useContent(pageId: string) {
  const [content, setContent] = useState<any>(null);
  const [localContent, setLocalContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/content/${pageId}`);
      setContent(data);
      setLocalContent(data);
      setError(null);
      setHasUnsavedChanges(false);
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

  const updateLocalContent = (newContent: any) => {
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const saveContent = async () => {
    if (!hasUnsavedChanges) return;

    try {
      await api.put(`/content/${pageId}`, localContent);
      setContent(localContent);
      setHasUnsavedChanges(false);
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
    content: localContent,
    loading,
    error,
    hasUnsavedChanges,
    updateContent: updateLocalContent,
    saveContent,
    updateSection,
    reloadContent: loadContent
  };
}