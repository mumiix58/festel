```typescript
import { useEffect, useState } from 'react';
import storage from '@/lib/storage';
import { Settings } from '@/types';

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
    const loadSettings = async () => {
      try {
        const settings = await storage.getSettings();
        setSocialMedia(settings.social);
        setError(null);
      } catch (err) {
        setError('Failed to fetch social media settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { socialMedia, loading, error };
}
```