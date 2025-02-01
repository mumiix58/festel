export const defaultServicesContent = {
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
      isActive: true
    },
    // Add more services...
  ],
  cta: {
    title: 'Maßgeschneiderte Lösungen für Ihren Anlass',
    description: 'Kontaktieren Sie uns für ein individuelles Angebot.',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Catering Services Wien | FEST\'LMACHER',
    description: 'Professionelles Catering für Hochzeiten, Firmenfeiern und Events in Wien.',
    keywords: 'catering wien, hochzeit catering, firmen catering'
  }
};