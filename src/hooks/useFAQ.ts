import { useState, useEffect } from 'react';
import { FAQContent } from '@/types';
import { getFAQContent, updateFAQContent } from '@/lib/faq';

export function useFAQ() {
  const [content, setContent] = useState<FAQContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const faqContent = await getFAQContent();
      setContent(faqContent);
      setError(null);
    } catch (err) {
      console.error('Error loading FAQ content:', err);
      setError('Failed to load FAQ content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: FAQContent) => {
    try {
      await updateFAQContent(newContent);
      setContent(newContent);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating FAQ content:', err);
      setError('Failed to update FAQ content');
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