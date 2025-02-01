import { useState, useEffect } from 'react';
import { ServicesPageContent } from '@/types';
import { getServicesContent, updateServicesContent } from '@/lib/services';

export function useServices() {
  const [content, setContent] = useState<ServicesPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const servicesContent = await getServicesContent();
      setContent(servicesContent);
      setError(null);
    } catch (err) {
      console.error('Error loading services content:', err);
      setError('Failed to load services content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: ServicesPageContent) => {
    try {
      await updateServicesContent(newContent);
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating services content:', err);
      setError('Failed to update services content');
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