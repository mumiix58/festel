import { v4 as uuidv4 } from 'uuid';
import { ServicesPageContent, ServiceContent } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for services
const servicesStore = localforage.createInstance({
  name: 'services',
  storeName: 'content'
});

// Default SEO-optimized services content
const defaultServicesContent: ServicesPageContent = {
  hero: {
    title: 'Unsere Dienstleistungen',
    subtitle: 'Professionelles Catering für jeden Anlass'
  },
  services: [
    {
      id: 'hochzeiten',
      title: 'Hochzeiten',
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
        description: 'Exklusives Hochzeits-Catering in Wien. Machen Sie Ihre Hochzeit zu einem unvergesslichen Erlebnis mit unserem professionellen Catering-Service.',
        keywords: 'hochzeit catering wien, hochzeitsfeier catering, hochzeitsbuffet, wedding catering'
      }
    },
    {
      id: 'firmenfeiern',
      title: 'Firmenfeiern',
      description: 'Professionelles Catering für Ihre Firmenveranstaltungen und Events.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      features: [
        'Flexible Menüoptionen',
        'Komplette Logistik',
        'Equipment-Bereitstellung',
        'Erfahrenes Personal'
      ],
      order: 1,
      buttonText: 'Mehr erfahren',
      buttonLink: '/termin?type=firmenfeiern',
      isActive: true,
      seo: {
        title: 'Firmen-Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Catering für Firmenfeiern und Business-Events in Wien. Erstklassiger Service für Ihre Unternehmensveranstaltung.',
        keywords: 'firmen catering wien, business catering, event catering, firmenfeier catering'
      }
    },
    {
      id: 'private-feiern',
      title: 'Private Feiern',
      description: 'Von Geburtstagen bis zu Jubiläen - wir machen Ihre Feier zum Erfolg.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      features: [
        'Personalisierte Menüs',
        'Buffet oder Service',
        'Komplettservice',
        'Beratung und Planung'
      ],
      order: 2,
      buttonText: 'Jetzt planen',
      buttonLink: '/termin?type=private-feiern',
      isActive: true,
      seo: {
        title: 'Privat-Catering Wien | FEST\'LMACHER',
        description: 'Individuelles Catering für private Feiern in Wien. Geburtstage, Jubiläen und andere besondere Anlässe perfekt ausgerichtet.',
        keywords: 'privat catering wien, geburtstag catering, jubiläum catering, familienfeier catering'
      }
    },
    {
      id: 'business-lunch',
      title: 'Business Lunch',
      description: 'Hochwertiges Catering für Ihre Geschäftstermine und Meetings.',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
      features: [
        'Fingerfood & Snacks',
        'Warme & kalte Speisen',
        'Getränkeservice',
        'Pünktliche Lieferung'
      ],
      order: 3,
      buttonText: 'Anfrage stellen',
      buttonLink: '/termin?type=business-lunch',
      isActive: true,
      seo: {
        title: 'Business Lunch Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Business Lunch Catering in Wien. Hochwertiges Essen für Ihre Geschäftstermine und Meetings.',
        keywords: 'business lunch wien, meeting catering, geschäftsessen catering'
      }
    },
    {
      id: 'gala-events',
      title: 'Gala Events',
      description: 'Erstklassiges Catering für Ihre exklusiven Veranstaltungen.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
      features: [
        'Mehrgängige Menüs',
        'Premium Service',
        'Weinbegleitung',
        'Eventplanung'
      ],
      order: 4,
      buttonText: 'Jetzt anfragen',
      buttonLink: '/termin?type=gala-events',
      isActive: true,
      seo: {
        title: 'Gala Event Catering Wien | FEST\'LMACHER',
        description: 'Exklusives Gala Event Catering in Wien. Erstklassiger Service für Ihre gehobene Veranstaltung.',
        keywords: 'gala catering wien, event catering, exklusives catering'
      }
    },
    {
      id: 'messen',
      title: 'Messen & Kongresse',
      description: 'Professionelle Verpflegung für Großveranstaltungen.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      features: [
        'Flexible Stationskonzepte',
        'Große Kapazitäten',
        'Effiziente Logistik',
        'Qualitätssicherung'
      ],
      order: 5,
      buttonText: 'Mehr erfahren',
      buttonLink: '/termin?type=messen',
      isActive: true,
      seo: {
        title: 'Messe & Kongress Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Catering für Messen und Kongresse in Wien. Flexible Lösungen für Großveranstaltungen.',
        keywords: 'messe catering wien, kongress catering, großveranstaltung catering'
      }
    },
    {
      id: 'flying-service',
      title: 'Flying Service',
      description: 'Mobile Bewirtung für Stehempfänge und Networking-Events.',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
      features: [
        'Fingerfood Kreationen',
        'Professionelle Servicekräfte',
        'Flexible Konzepte',
        'Getränkeservice'
      ],
      order: 6,
      buttonText: 'Anfrage stellen',
      buttonLink: '/termin?type=flying-service',
      isActive: true,
      seo: {
        title: 'Flying Service Catering Wien | FEST\'LMACHER',
        description: 'Professioneller Flying Service in Wien. Mobile Bewirtung für Stehempfänge und Networking-Events.',
        keywords: 'flying service wien, fingerfood catering, stehempfang catering'
      }
    },
    {
      id: 'outdoor-events',
      title: 'Outdoor Events',
      description: 'Catering für Ihre Veranstaltungen unter freiem Himmel.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      features: [
        'BBQ & Grillstationen',
        'Mobile Küchen',
        'Wetterfeste Ausstattung',
        'Komplette Infrastruktur'
      ],
      order: 7,
      buttonText: 'Jetzt planen',
      buttonLink: '/termin?type=outdoor-events',
      isActive: true,
      seo: {
        title: 'Outdoor Event Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Outdoor Catering in Wien. Perfekte Lösung für Ihre Veranstaltung unter freiem Himmel.',
        keywords: 'outdoor catering wien, grill catering, bbq service'
      }
    },
    {
      id: 'seminare',
      title: 'Seminare & Workshops',
      description: 'Passende Verpflegung für Ihre Bildungsveranstaltungen.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
      features: [
        'Gesunde Snacks',
        'Kaffeepausen',
        'Mittagsverpflegung',
        'Flexible Zeiten'
      ],
      order: 8,
      buttonText: 'Anfrage stellen',
      buttonLink: '/termin?type=seminare',
      isActive: true,
      seo: {
        title: 'Seminar & Workshop Catering Wien | FEST\'LMACHER',
        description: 'Professionelles Catering für Seminare und Workshops in Wien. Flexible Verpflegung für Bildungsveranstaltungen.',
        keywords: 'seminar catering wien, workshop catering, bildungsveranstaltung catering'
      }
    }
  ],
  cta: {
    title: 'Maßgeschneiderte Lösungen für Ihren Anlass',
    description: 'Kontaktieren Sie uns für ein individuelles Angebot. Wir beraten Sie gerne und erstellen ein auf Ihre Bedürfnisse zugeschnittenes Konzept.',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Catering Services Wien | FEST\'LMACHER | Professionelles Event Catering',
    description: 'Entdecken Sie unsere professionellen Catering-Services in Wien. Von Hochzeiten über Firmenfeiern bis zu privaten Events - für jeden Anlass das passende Catering.',
    keywords: 'catering wien, event catering, hochzeit catering, firmen catering, business catering, private feiern catering'
  }
};

// Get services content
export async function getServicesContent(): Promise<ServicesPageContent> {
  try {
    const content = await servicesStore.getItem<ServicesPageContent>('content');
    
    // If no custom content exists, save and return default content
    if (!content) {
      await servicesStore.setItem('content', defaultServicesContent);
      return defaultServicesContent;
    }

    // Merge custom content with default content to ensure all services exist
    const mergedServices = [...defaultServicesContent.services];
    
    // Add or update custom services
    content.services.forEach(customService => {
      const index = mergedServices.findIndex(s => s.id === customService.id);
      if (index >= 0) {
        mergedServices[index] = customService;
      } else {
        mergedServices.push(customService);
      }
    });

    // Sort services by order
    mergedServices.sort((a, b) => a.order - b.order);

    return {
      ...content,
      services: mergedServices
    };
  } catch (error) {
    console.error('Error loading services content:', error);
    return defaultServicesContent;
  }
}

// Update services content
export async function updateServicesContent(content: ServicesPageContent): Promise<void> {
  try {
    await servicesStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating services content:', error);
    throw new Error('Fehler beim Speichern der Dienstleistungen');
  }
}

// Add new service
export async function addService(service: Omit<ServiceContent, 'id' | 'order'>): Promise<ServiceContent> {
  try {
    const content = await getServicesContent();
    const newService: ServiceContent = {
      ...service,
      id: `service-${uuidv4()}`,
      order: content.services.length
    };
    
    content.services.push(newService);
    await updateServicesContent(content);
    return newService;
  } catch (error) {
    console.error('Error adding service:', error);
    throw new Error('Fehler beim Hinzufügen der Dienstleistung');
  }
}

// Update service
export async function updateService(serviceId: string, updates: Partial<ServiceContent>): Promise<void> {
  try {
    const content = await getServicesContent();
    content.services = content.services.map(service =>
      service.id === serviceId ? { ...service, ...updates } : service
    );
    await updateServicesContent(content);
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Fehler beim Aktualisieren der Dienstleistung');
  }
}

// Delete service
export async function deleteService(serviceId: string): Promise<void> {
  try {
    const content = await getServicesContent();
    content.services = content.services
      .filter(service => service.id !== serviceId)
      .map((service, index) => ({ ...service, order: index }));
    await updateServicesContent(content);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Fehler beim Löschen der Dienstleistung');
  }
}

// Reorder services
export async function reorderServices(serviceId: string, newOrder: number): Promise<void> {
  try {
    const content = await getServicesContent();
    const service = content.services.find(s => s.id === serviceId);
    if (!service) return;

    const oldOrder = service.order;
    content.services = content.services.map(s => {
      if (s.id === serviceId) {
        return { ...s, order: newOrder };
      }
      if (newOrder > oldOrder && s.order <= newOrder && s.order > oldOrder) {
        return { ...s, order: s.order - 1 };
      }
      if (newOrder < oldOrder && s.order >= newOrder && s.order < oldOrder) {
        return { ...s, order: s.order + 1 };
      }
      return s;
    });

    await updateServicesContent(content);
  } catch (error) {
    console.error('Error reordering services:', error);
    throw new Error('Fehler beim Neuordnen der Dienstleistungen');
  }
}