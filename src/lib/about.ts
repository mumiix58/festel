import { v4 as uuidv4 } from 'uuid';
import { AboutContent } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for about content
const aboutStore = localforage.createInstance({
  name: 'about',
  storeName: 'content'
});

// Default SEO-optimized about content
const defaultAboutContent: AboutContent = {
  hero: {
    title: 'Über Uns',
    subtitle: 'Ihr vertrauenswürdiger Partner für erstklassiges Catering',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  },
  story: {
    title: 'Unsere Geschichte',
    content: `FEST'LMACHER steht seit über 20 Jahren für erstklassiges Catering und perfekten Service in Wien. Als erfahrener Gastronom wissen wir, worauf es bei der Planung und Durchführung von Events ankommt.

Unser Erfolg basiert auf der Leidenschaft für exzellente Küche und dem Streben nach perfektem Service. Jede Veranstaltung ist für uns einzigartig und verdient besondere Aufmerksamkeit.`,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  },
  values: [
    {
      id: uuidv4(),
      title: 'Qualität',
      description: 'Wir verwenden nur die besten Zutaten und arbeiten mit lokalen Lieferanten zusammen. Jedes Gericht wird mit höchster Sorgfalt zubereitet.'
    },
    {
      id: uuidv4(),
      title: 'Innovation',
      description: 'Unsere Küche verbindet Tradition mit modernen Einflüssen. Wir entwickeln ständig neue Konzepte und bleiben kulinarisch am Puls der Zeit.'
    },
    {
      id: uuidv4(),
      title: 'Nachhaltigkeit',
      description: 'Umweltbewusstes Handeln ist Teil unserer Unternehmensphilosophie. Wir setzen auf ressourcenschonende Prozesse und minimieren Abfälle.'
    },
    {
      id: uuidv4(),
      title: 'Regionalität',
      description: 'Wir setzen auf regionale Produkte und unterstützen damit lokale Produzenten. Kurze Transportwege schonen die Umwelt und garantieren Frische.'
    },
    {
      id: uuidv4(),
      title: 'Service-Exzellenz',
      description: 'Unser professionelles Team garantiert erstklassigen Service und perfekte Betreuung. Wir machen Ihre Veranstaltung zu einem unvergesslichen Erlebnis.'
    },
    {
      id: uuidv4(),
      title: 'Verantwortung',
      description: 'Wir übernehmen soziale Verantwortung und engagieren uns für faire Arbeitsbedingungen. Nachhaltiges Wirtschaften ist für uns selbstverständlich.'
    }
  ],
  team: [
    {
      id: uuidv4(),
      name: 'Michael Weber',
      role: 'Küchenchef',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      description: 'Experte für internationale Küche mit über 15 Jahren Erfahrung.'
    },
    {
      id: uuidv4(),
      name: 'Anna Schmidt',
      role: 'Event Managerin',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      description: 'Spezialisiert auf die Organisation von Großveranstaltungen.'
    },
    {
      id: uuidv4(),
      name: 'Thomas Müller',
      role: 'Sommelier',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      description: 'Zertifizierter Sommelier mit exzellentem Weinwissen.'
    },
    {
      id: uuidv4(),
      name: 'Laura Klein',
      role: 'Patissière',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      description: 'Kreiert einzigartige Desserts und Süßspeisen.'
    }
  ],
  seo: {
    title: 'Über Uns - FEST\'LMACHER Catering Wien | Professioneller Catering Service',
    description: 'Lernen Sie FEST\'LMACHER kennen - Ihr professioneller Catering Service in Wien. ✓ 20+ Jahre Erfahrung ✓ Erstklassige Qualität ✓ Perfekter Service',
    keywords: 'catering wien, über uns, catering service, event catering, festlmacher team, catering qualität, nachhaltiges catering'
  }
};

// Get about content
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const content = await aboutStore.getItem<AboutContent>('content');
    return content || defaultAboutContent;
  } catch (error) {
    console.error('Error loading about content:', error);
    return defaultAboutContent;
  }
}

// Update about content
export async function updateAboutContent(content: AboutContent): Promise<void> {
  try {
    await aboutStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating about content:', error);
    throw new Error('Fehler beim Speichern der Über Uns-Inhalte');
  }
}