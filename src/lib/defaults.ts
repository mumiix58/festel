import { Settings } from '@/types';

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
      email: "catering@festlmacher.at"
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
    keywords: "catering wien, event catering, hochzeit catering, firmen catering, party service, buffet service, gourmet catering, festlmacher"
  }
};