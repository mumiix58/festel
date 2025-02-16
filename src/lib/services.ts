import { ServicesPageContent } from '@/types';
import api from '@/lib/api';

// Default content
const defaultContent: ServicesPageContent = {
  hero: {
    title: 'Dienstleistungen',
    subtitle: 'Professionelles Catering für jeden Anlass'
  },
  services: [
    {
      id: 'hochzeiten',
      title: 'Hochzeits-Catering',
      description: 'Machen Sie Ihren besonderen Tag unvergesslich mit unserem exklusiven Hochzeits-Catering.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
      features: [
        'Individuelle Menüplanung',
        'Professioneller Service',
        'Dekoration und Setup',
        'Getränkeservice'
      ],
      order: 0,
      buttonText: 'Jetzt anfragen',
      buttonLink: '/termin?type=hochzeiten',
      isActive: true,
      seo: {
        title: 'Hochzeits-Catering Wien | FEST\'LMACHER',
        description: 'Exklusives Hochzeits-Catering in Wien',
        keywords: 'hochzeit catering wien, hochzeitsfeier'
      }
    },
    {
      id: 'firmenfeiern',
      title: 'Firmen-Catering',
      description: 'Professionelles Catering für Ihre Firmenveranstaltungen, Meetings und Events.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      features: [
        'Business Lunch',
        'Konferenz-Catering',
        'Gala-Dinner',
        'Flying Service'
      ],
      order: 1,
      buttonText: 'Jetzt anfragen',
      buttonLink: '/termin?type=firmenfeiern',
      isActive: true,
      seo: {
        title: 'Firmen-Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Catering für Firmenveranstaltungen',
        keywords: 'firmen catering wien, business catering'
      }
    },
    {
      id: 'private-feiern',
      title: 'Event-Catering',
      description: 'Full-Service Catering für Ihre privaten Feiern und Events.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      features: [
        'Geburtstage',
        'Jubiläen',
        'Private Feiern',
        'Garten-Partys'
      ],
      order: 2,
      buttonText: 'Jetzt anfragen',
      buttonLink: '/termin?type=private-feiern',
      isActive: true,
      seo: {
        title: 'Event-Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Event-Catering in Wien',
        keywords: 'event catering wien, party service'
      }
    }
  ],
  cta: {
    title: 'Interesse geweckt?',
    description: 'Kontaktieren Sie uns für ein individuelles Angebot',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Catering Services Wien | FEST\'LMACHER',
    description: 'Professionelles Catering für Hochzeiten, Firmenfeiern und Events in Wien',
    keywords: 'catering wien, hochzeit catering, firmen catering'
  }
};

// Get services content from backend with fallback
export async function getServicesContent(): Promise<ServicesPageContent> {
  try {
    const response = await api.get('/content/services');
    // Return response content if valid, otherwise use default
    if (response?.content && response.content.hero && response.content.services) {
      return response.content;
    }
    // Return default content if response is invalid
    return defaultContent;
  } catch (error) {
    console.error('Error loading services content:', error);
    // Return default content on error
    return defaultContent;
  }
}

// Update services content
export async function updateServicesContent(content: ServicesPageContent): Promise<boolean> {
  try {
    const response = await api.put('/content/services', { content });
    return !!response;
  } catch (error) {
    console.error('Error updating services content:', error);
    throw error;
  }
}