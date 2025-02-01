import { Helmet } from 'react-helmet-async';
import { SEOMetadata } from '@/types';
import { useSettings } from '@/hooks/useSettings';

interface SEOProps {
  metadata: SEOMetadata;
}

export function SEO({ metadata }: SEOProps) {
  const { settings } = useSettings();
  const siteName = settings?.company.name || "FEST'LMACHER Gastronomie";

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}
    </Helmet>
  );
}