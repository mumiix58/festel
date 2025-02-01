import { useEffect, useState } from 'react';
import storage from '@/lib/storage';

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export function useSocialMedia() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const settings = storage.getSettings();
      setSocialMedia(settings.social);
      setError(null);
    } catch (err) {
      setError('Failed to fetch social media settings');
    } finally {
      setLoading(false);
    }
  }, []);

  return { socialMedia, loading, error };
}