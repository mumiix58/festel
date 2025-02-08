import Content from '../models/Content.js';
import { v4 as uuidv4 } from 'uuid';

// Default About content
const defaultAboutContent = {
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
      description: 'Wir verwenden nur die besten Zutaten und arbeiten mit lokalen Lieferanten zusammen.'
    },
    {
      id: uuidv4(),
      title: 'Innovation',
      description: 'Unsere Küche verbindet Tradition mit modernen Einflüssen.'
    },
    {
      id: uuidv4(),
      title: 'Nachhaltigkeit',
      description: 'Umweltbewusstes Handeln ist Teil unserer Unternehmensphilosophie.'
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
    }
  ],
  seo: {
    title: "Über Uns - FEST'LMACHER Catering Wien",
    description: "Lernen Sie FEST'LMACHER kennen - Ihr professioneller Catering Service in Wien.",
    keywords: "catering wien, über uns, catering service"
  }
};

export async function initializeContent() {
  try {
    console.log('Initializing default content...');

    // Check if about content exists
    const aboutContent = await Content.findOne({ page: 'about' });
    if (!aboutContent) {
      await Content.create({
        page: 'about',
        content: defaultAboutContent
      });
      console.log('Default about content initialized');
    }

    console.log('Content initialization complete');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}