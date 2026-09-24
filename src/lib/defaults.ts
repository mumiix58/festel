import { Settings, FAQContent, ServicesPageContent } from '@/types';

export const defaultSettings: Settings = {
  logo: '/logo.png',
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
      email: "info@cateringandmore.at"
    }
  },
  social: {
    facebook: "https://facebook.com/festlmacher",
    instagram: "https://instagram.com/festlmacher",
    linkedin: "https://linkedin.com/company/festlmacher"
  },
  seo: {
    title: "Fest'lmacher Gastronomie | Ihr Catering Partner in Wien",
    description: "Professioneller Catering-Service in Wien für Ihre Veranstaltungen. Hochwertige Speisen, erstklassiger Service und maßgeschneiderte Lösungen für jeden Anlass.",
    keywords: "catering wien, event catering, hochzeit catering, firmen catering, party service, buffet service"
  }
};

export const defaultFAQContent: FAQContent = {
  hero: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Service'
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'Wie weit im Voraus sollte ich buchen?',
      answer: 'Wir empfehlen, mindestens 4-6 Wochen im Voraus zu buchen.',
      order: 0,
      isActive: true
    },
    {
      id: 'faq-2',
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

export const defaultServicesContent: ServicesPageContent = {
  hero: {
    title: 'Dienstleistungen',
    subtitle: 'Unsere Catering Services'
  },
  services: [],
  cta: {
    title: 'Interesse geweckt?',
    description: 'Kontaktieren Sie uns für ein individuelles Angebot',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Dienstleistungen | FEST\'LMACHER',
    description: 'Professionelle Catering Services in Wien',
    keywords: 'catering wien, dienstleistungen'
  }
};