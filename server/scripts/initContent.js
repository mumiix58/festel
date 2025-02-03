import { Content } from '../models/Content.js';
import { Settings } from '../models/Settings.js';
import { Slider } from '../models/Slider.js';
import { FAQ } from '../models/FAQ.js';
import { Service } from '../models/Service.js';
import { Reference } from '../models/Reference.js';
import { Equipment } from '../models/Equipment.js';
import { Legal } from '../models/Legal.js';
import { 
  defaultHomeContent,
  defaultAboutContent,
  defaultServicesContent,
  defaultFAQContent,
  defaultReferencesContent
} from '../data/defaultContent.js';

export async function initializeContent() {
  try {
    console.log('Initializing default content in MongoDB...');

    // Initialize Content collection with default content
    const contentTypes = [
      { page: 'home', content: defaultHomeContent },
      { page: 'about', content: defaultAboutContent },
      { page: 'services', content: defaultServicesContent },
      { page: 'faq', content: defaultFAQContent },
      { page: 'references', content: defaultReferencesContent }
    ];

    for (const { page, content } of contentTypes) {
      const existingContent = await Content.findOne({ page });
      if (!existingContent) {
        await Content.create({ page, content });
        console.log(`Default ${page} content initialized`);
      }
    }

    // Initialize default slider content
    const existingSlides = await Slider.countDocuments();
    if (existingSlides === 0) {
      await Slider.create([
        {
          image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
          title: 'Erstklassiges Catering',
          subtitle: 'Für jeden Anlass die perfekte Lösung',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 0,
          showLogo: true,
          isActive: true
        },
        {
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
          title: 'Professionelles Catering',
          subtitle: 'Hochwertige Speisen und erstklassiger Service',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 1,
          showLogo: false,
          isActive: true
        }
      ]);
      console.log('Default slider content initialized');
    }

    // Initialize default FAQ content
    const existingFAQs = await FAQ.countDocuments();
    if (existingFAQs === 0) {
      await FAQ.create(defaultFAQContent.faqs);
      console.log('Default FAQ content initialized');
    }

    // Initialize default services
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.create(defaultServicesContent.services);
      console.log('Default services initialized');
    }

    // Initialize default references/testimonials
    const existingReferences = await Reference.countDocuments();
    if (existingReferences === 0) {
      await Reference.create(defaultReferencesContent.testimonials);
      console.log('Default references initialized');
    }

    // Initialize default equipment categories
    const existingEquipment = await Equipment.countDocuments();
    if (existingEquipment === 0) {
      await Equipment.create([
        {
          name: 'Equipment',
          slug: 'equipment',
          description: 'Professionelle Ausstattung für Ihre Veranstaltung',
          items: [
            {
              title: 'Geschirr & Besteck',
              description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
              image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
              order: 0,
              isActive: true
            },
            {
              title: 'Gläser',
              description: 'Verschiedene Gläserserien für Wein, Champagner und Cocktails',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 1,
              isActive: true
            }
          ],
          order: 0,
          isActive: true
        },
        {
          name: 'Tischwäsche',
          slug: 'tischwasche',
          description: 'Hochwertige Tischwäsche für Ihre Veranstaltung',
          items: [
            {
              title: 'Tischdecken',
              description: 'Hochwertige Tischdecken in verschiedenen Größen und Farben',
              image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800',
              order: 0,
              isActive: true
            },
            {
              title: 'Servietten',
              description: 'Stoffservietten passend zu Ihrer Veranstaltung',
              image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
              order: 1,
              isActive: true
            }
          ],
          order: 1,
          isActive: true
        }
      ]);
      console.log('Default equipment categories initialized');
    }

    // Initialize default legal content
    const existingLegal = await Legal.countDocuments();
    if (existingLegal === 0) {
      await Legal.create([
        {
          type: 'impressum',
          content: `# Impressum\n\n## Unternehmensangaben\nFEST'LMACHER Gastronomie\nDDSG, Handelskai 265\n1220 Wien\nÖsterreich`
        },
        {
          type: 'datenschutz',
          content: `# Datenschutzerklärung\n\n## 1. Datenschutz auf einen Blick\nDie folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.`
        },
        {
          type: 'agb',
          content: `# Allgemeine Geschäftsbedingungen\n\n## 1. Geltungsbereich\nDiese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.`
        }
      ]);
      console.log('Default legal content initialized');
    }

    // Initialize default settings if not exists
    const existingSettings = await Settings.countDocuments();
    if (existingSettings === 0) {
      await Settings.create({
        company: {
          name: "FEST'LMACHER Gastronomie",
          address: {
            street: "Handelskai 265",
            city: "Wien",
            postalCode: "1020",
            country: "Österreich"
          },
          contact: {
            phone: "+43 (0)699 – 1600 2800",
            email: "catering@festlmacher.at"
          }
        },
        social: {
          facebook: "https://facebook.com/festlmacher",
          instagram: "https://instagram.com/festlmacher",
          linkedin: "https://linkedin.com/company/festlmacher"
        },
        seo: {
          title: "FEST'LMACHER Gastronomie | Ihr Catering Partner in Wien",
          description: "Professioneller Catering-Service in Wien für Ihre Veranstaltungen.",
          keywords: "catering wien, event catering, hochzeit catering"
        }
      });
      console.log('Default settings initialized');
    }

    console.log('All default content successfully initialized in MongoDB');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}