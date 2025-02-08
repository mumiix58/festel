import { useState, useEffect } from 'react';
import { AboutContent } from '@/types';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export function useAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const aboutContent = await api.get('/content/about');
      setContent(aboutContent);
      setError(null);
    } catch (err) {
      console.error('Error loading about content:', err);
      setError('Failed to load about content');
      showToast.error('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: AboutContent) => {
    try {
      setContent(newContent);
      return true;
    } catch (err) {
      console.error('Error updating about content:', err);
      setError('Failed to update about content');
      showToast.error('Fehler beim Aktualisieren der Inhalte');
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