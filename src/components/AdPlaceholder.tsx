import { useEffect, useState } from 'react';

interface AdSection {
  location: string;
  code: string;
  active: boolean;
}

interface AdPlaceholderProps {
  location: string;
  className?: string;
}

export function AdPlaceholder({ location, className = '' }: AdPlaceholderProps) {
  const [adSection, setAdSection] = useState<AdSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAdSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const section = data.ads?.sections?.find(
          (section: AdSection) => section.location === location && section.active
        );
        
        setAdSection(section || null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch ad settings:', error);
        setAdSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdSettings();

    return () => {
      controller.abort();
    };
  }, [location]);

  if (loading || !adSection?.code) {
    return null;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: adSection.code }}
    />
  );
}