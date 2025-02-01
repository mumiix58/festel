import { FooterContent } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for footer
const footerStore = localforage.createInstance({
  name: 'footer',
  storeName: 'content'
});

// Default SEO-optimized footer content
const defaultFooterContent: FooterContent = {
  description: 'FEST\'LMACHER - Ihr professioneller Catering Service in Wien. Wir bieten erstklassiges Catering für Hochzeiten, Firmenfeiern, private Events und Business-Veranstaltungen. Mit über 20 Jahren Erfahrung garantieren wir höchste Qualität und perfekten Service.',
  openingHours: [
    { day: 'Montag - Freitag', hours: '09:00 - 18:00' },
    { day: 'Samstag', hours: 'Nach Vereinbarung' },
    { day: 'Sonntag', hours: 'Nach Vereinbarung' }
  ],
  quickLinks: [
    { text: 'Impressum', url: '/impressum', isExternal: false },
    { text: 'Datenschutz', url: '/datenschutz', isExternal: false },
    { text: 'AGB', url: '/agb', isExternal: false }
  ],
  schemaOrg: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CateringService',
    'name': 'FEST\'LMACHER Gastronomie',
    'description': 'Professioneller Catering Service in Wien für Hochzeiten, Firmenfeiern und Events',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Handelskai 265',
      'addressLocality': 'Wien',
      'postalCode': '1020',
      'addressCountry': 'AT'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '48.2244928',
      'longitude': '16.4075976'
    },
    'telephone': '+43-699-1600-2800',
    'email': 'info@festlmacher.at',
    'url': 'https://festlmacher.at',
    'openingHours': [
      'Mo-Fr 09:00-18:00',
      'Sa-Su By appointment'
    ],
    'priceRange': '€€-€€€',
    'servesCuisine': [
      'Austrian',
      'International',
      'Gourmet'
    ]
  }, null, 2),
  metaKeywords: 'catering wien, event catering, hochzeit catering, firmen catering, business catering, party service, buffet service, gourmet catering, festlmacher'
};

// Get footer content
export async function getFooterContent(): Promise<FooterContent> {
  try {
    const content = await footerStore.getItem<FooterContent>('content');
    return content || defaultFooterContent;
  } catch (error) {
    console.error('Error loading footer content:', error);
    return defaultFooterContent;
  }
}

// Update footer content
export async function updateFooterContent(content: FooterContent): Promise<void> {
  try {
    await footerStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating footer content:', error);
    throw new Error('Fehler beim Speichern der Footer-Inhalte');
  }
}