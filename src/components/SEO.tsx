import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SEOMetadata } from '@/types';
import { canonicalPath, canonicalUrl, seoPages, SITE_NAME, SITE_LOGO, pageGraph, serializeJsonLd } from '@/lib/seo';

interface SEOProps { metadata?: SEOMetadata; noindex?: boolean; faqs?: {question:string;answer:string}[] }
export function SEO({ metadata, noindex, faqs = [] }: SEOProps) {
  const { pathname } = useLocation();
  const path = canonicalPath(pathname);
  const registered = seoPages.find(page => page.path === path);
  const page = {path,label:metadata?.title || registered?.label || 'Seite nicht gefunden',...registered,
    title:metadata?.title || registered?.title || `Seite nicht gefunden | ${SITE_NAME}`,
    description:metadata?.description || registered?.description || 'Die gesuchte Seite wurde nicht gefunden.'};
  const excluded = noindex || registered?.noindex || pathname.startsWith('/admin') || (!registered && !metadata);
  const image = metadata?.ogImage ? new URL(metadata.ogImage, canonicalUrl('/')).href : SITE_LOGO;
  return <Helmet>
    <html lang="de-AT" />
    <title>{page.title}</title>
    <meta name="description" content={page.description} />
    <meta name="robots" content={excluded ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
    <link rel="canonical" href={canonicalUrl(path)} />
    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={page.description} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content="de_AT" />
    <meta property="og:url" content={canonicalUrl(path)} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={`${SITE_NAME} – catering and more`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={page.title} />
    <meta name="twitter:description" content={page.description} />
    <meta name="twitter:image" content={image} />
    <script id="seo-graph" type="application/ld+json">{serializeJsonLd(excluded ? {} : pageGraph(page, faqs))}</script>
  </Helmet>;
}

// Pages with their own metadata render exactly one graph.
export function DefaultSEO() {
 const {pathname}=useLocation();
 const path=canonicalPath(pathname);
 if(path==='/' || path==='/sss' || path.startsWith('/catering-and-more/')) return null;
 return <SEO />;
}
