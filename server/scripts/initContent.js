import Content from '../models/Content.js';
import { v4 as uuidv4 } from 'uuid';

// Default Services content
const defaultServicesContent = {
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

// Default Slider content
const defaultSliderContent = {
  slides: [
    {
      id: uuidv4(),
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
      title: 'Erstklassiges Catering',
      subtitle: 'Für jeden Anlass die perfekte Lösung',
      buttonText: 'Jetzt anfragen',
      buttonLink: '/kontakt',
      order: 0,
      showLogo: true
    },
    {
      id: uuidv4(),
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      title: 'Hochzeits-Catering',
      subtitle: 'Machen Sie Ihren besonderen Tag unvergesslich',
      buttonText: 'Mehr erfahren',
      buttonLink: '/dienstleistungen',
      order: 1,
      showLogo: false
    }
  ]
};

// Default Equipment content
const defaultEquipmentContent = {
  categories: [
    {
      id: uuidv4(),
      name: 'Equipment',
      slug: 'equipment',
      description: 'Professionelle Ausstattung für Ihre Veranstaltung',
      items: [
        {
          id: uuidv4(),
          title: 'Geschirr & Besteck',
          description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
          image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
          order: 0,
          isActive: true
        },
        {
          id: uuidv4(),
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
      id: uuidv4(),
      name: 'Tischwäsche',
      slug: 'tischwasche',
      description: 'Hochwertige Tischwäsche für Ihre Veranstaltung',
      items: [
        {
          id: uuidv4(),
          title: 'Tischdecken',
          description: 'Hochwertige Tischdecken in verschiedenen Größen und Farben',
          image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800',
          order: 0,
          isActive: true
        },
        {
          id: uuidv4(),
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
  ]
};

// Default Legal content
const defaultLegalContent = {
  impressum: `# Impressum

FEST'LMACHER Gastronomie
DDSG, Handelskai 265
1220 Wien
Österreich

**Kontakt:**
Tel: +43 (0)699 – 1600 2800
E-Mail: catering@festlmacher.at`,

  datenschutz: `# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.`,

  agb: `# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.`
};

// Default About content
const defaultAboutContent = {
  hero: {
    title: 'Über Uns',
    subtitle: 'Ihr vertrauenswürdiger Partner für erstklassiges Catering',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  },
  story: {
    title: 'Unsere Geschichte',
    content: `FEST'LMACHER steht seit über 20 Jahren für erstklassiges Catering und perfekten Service in Wien. Als erfahrener Gastronom wissen wir, worauf es bei der Planung und Durchführung von Events ankommt.`,
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
    }
  ],
  seo: {
    title: "Über Uns - FEST'LMACHER Catering Wien",
    description: "Lernen Sie FEST'LMACHER kennen - Ihr professioneller Catering Service in Wien.",
    keywords: "catering wien, über uns, catering service, event catering"
  }
};

// Default FAQ content
const defaultFAQContent = {
  hero: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Service'
  },
  faqs: [
    {
      id: uuidv4(),
      question: 'Wie weit im Voraus sollte ich buchen?',
      answer: 'Wir empfehlen, mindestens 4-6 Wochen im Voraus zu buchen.',
      order: 0,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Welche Regionen beliefern Sie?',
      answer: 'Wir sind in ganz Wien und Umgebung für Sie da.',
      order: 1,
      isActive: true
    }
  ],
  cta: {
    title: 'Noch Fragen?',
    description: 'Kontaktieren Sie uns gerne für weitere Informationen.',
    buttonText: 'Kontakt aufnehmen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'FAQ - FEST\'LMACHER Catering Wien',
    description: 'Häufig gestellte Fragen zu unserem Catering-Service in Wien.',
    keywords: 'catering wien faq, catering fragen'
  }
};

// Default References content
const defaultReferencesContent = {
  hero: {
    title: 'Referenzen',
    subtitle: 'Was unsere Kunden über uns sagen'
  },
  testimonials: [
    {
      id: uuidv4(),
      name: 'Julia & Marcus',
      event: 'Hochzeit',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
      quote: 'Das Catering war absolut erstklassig.',
      rating: 5,
      order: 0,
      isActive: true
    }
  ],
  cta: {
    title: 'Werden Sie unser nächster zufriedener Kunde',
    description: 'Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Referenzen - FEST\'LMACHER Catering Wien',
    description: 'Kundenstimmen zu unserem Catering-Service in Wien.',
    keywords: 'catering wien referenzen, catering bewertungen'
  }
};

// Default Footer content
const defaultFooterContent = {
  description: 'FEST\'LMACHER - Ihr professioneller Catering Service in Wien. Wir bieten erstklassiges Catering für Hochzeiten, Firmenfeiern, private Events und Business-Veranstaltungen.',
  openingHours: [
    { day: 'Montag - Freitag', hours: '09:00 - 18:00' },
    { day: 'Samstag', hours: 'Nach Vereinbarung' },
    { day: 'Sonntag', hours: 'Nach Vereinbarung' }
  ],
  quickLinks: [
    { text: 'Impressum', url: '/impressum', isExternal: false },
    { text: 'Datenschutz', url: '/datenschutz', isExternal: false },
    { text: 'AGB', url: '/agb', isExternal: false }
  ]
};

// Default Home content
const defaultHomeContent = {
  stats: [
    {
      id: uuidv4(),
      value: '2.500+',
      label: 'Zufriedene Kunden',
      order: 0,
      isActive: true
    },
    {
      id: uuidv4(),
      value: '15.000+',
      label: 'Events durchgeführt',
      order: 1,
      isActive: true
    },
    {
      id: uuidv4(),
      value: '50+',
      label: 'Professionelle Mitarbeiter',
      order: 2,
      isActive: true
    },
    {
      id: uuidv4(),
      value: '20+',
      label: 'Jahre Erfahrung',
      order: 3,
      isActive: true
    }
  ],
  seo: {
    title: "FEST'LMACHER Gastronomie | Professionelles Catering in Wien",
    description: "Ihr Partner für erstklassiges Catering in Wien. Hochzeiten, Firmenfeiern, private Events und mehr. ✓ 20+ Jahre Erfahrung ✓ 2.500+ zufriedene Kunden",
    keywords: "catering wien, event catering, hochzeit catering, firmen catering, party service, buffet service"
  }
};

// Initialize all content collections
export async function initializeContent() {
  try {
    console.log('Initializing default content...');

    // Define content pages to initialize
    const contentPages = [
      { page: 'about', content: defaultAboutContent },
      { page: 'faq', content: defaultFAQContent },
      { page: 'references', content: defaultReferencesContent },
      { page: 'footer', content: defaultFooterContent },
      { page: 'home', content: defaultHomeContent },
      { page: 'services', content: defaultServicesContent },
      { page: 'slider', content: defaultSliderContent },
      { page: 'equipment', content: defaultEquipmentContent },
      { page: 'legal', content: defaultLegalContent }
    ];

    // Initialize each content page
    for (const { page, content } of contentPages) {
      const existingContent = await Content.findOne({ page });
      if (!existingContent) {
        await Content.create({ page, content });
        console.log(`Default ${page} content initialized`);
      }
    }

    console.log('Content initialization complete');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}