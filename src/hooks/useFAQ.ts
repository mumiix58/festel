import { useState, useEffect } from 'react';
import { FAQContent } from '@/types';
import { getFAQContent, updateFAQContent } from '@/lib/faq';
import { showToast } from '@/lib/toast';

export function useFAQ() {
  const [content, setContent] = useState<FAQContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const faqContent = await getFAQContent();
      setContent(faqContent);
      setError(null);
    } catch (err) {
      console.error('Error loading FAQ content:', err);
      setError('Failed to load FAQ content');
      showToast.error('Fehler beim Laden der FAQ-Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: FAQContent): Promise<boolean> => {
    try {
      setError(null);
      await updateFAQContent(newContent);
      setContent(newContent);
      showToast.success('FAQ-Inhalte erfolgreich gespeichert');
      return true;
    } catch (err) {
      console.error('Error updating FAQ content:', err);
      setError('Failed to update FAQ content');
      showToast.error('Fehler beim Speichern der FAQ-Inhalte');
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