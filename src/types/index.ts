// Add UserProfile type
export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

// Base Types
export interface ImageContent {
  id: string;
  url: string;
  alt: string;
  title: string;
  description?: string;
  isDefault?: boolean;
}

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

// Page Content Types
export interface PageContent {
  sections: PageSection[];
}

export interface PageSection {
  id: string;
  type: 'hero' | 'stats' | 'services' | 'gallery' | 'cta';
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  images?: ImageContent[];
  items?: any[];
}

// Slider Types
export interface SlideContent {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  showLogo?: boolean;
  isActive?: boolean;
  cloudinaryPublicId?: string;
}

// Settings Types
export interface Settings {
  logo?: string;
  company: {
    name: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact: {
      phone: string;
      email: string;
    };
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    googleMapsApiKey?: string;
    googlePlaceId?: string;
    googleAnalyticsId?: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  token: string;
}

// Content Types
export interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  story: {
    title: string;
    content: string;
    image: string;
  };
  values: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    image: string;
    description?: string;
  }>;
  seo: SEOMetadata;
}

export interface FAQContent {
  hero: {
    title: string;
    subtitle: string;
  };
  faqs: Array<FAQItem>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo: SEOMetadata;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface FooterContent {
  description: string;
  openingHours: Array<{
    day: string;
    hours: string;
  }>;
  quickLinks: Array<{
    text: string;
    url: string;
    isExternal: boolean;
  }>;
  schemaOrg: string;
  metaKeywords: string;
}

export interface LegalContent {
  impressum: string;
  datenschutz: string;
  agb: string;
}

export interface ReferencesContent {
  hero: {
    title: string;
    subtitle: string;
  };
  testimonials: Array<TestimonialContent>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo: SEOMetadata;
}

export interface TestimonialContent {
  id: string;
  name: string;
  event: string;
  image: string;
  quote: string;
  rating: number;
  order: number;
  isActive: boolean;
}

export interface ServicesPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  services: Array<ServiceContent>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo: SEOMetadata;
}

export interface ServiceContent {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  order: number;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  seo: SEOMetadata;
}

export interface HomeContent {
  stats: Array<StatContent>;
  seo: SEOMetadata;
}

export interface StatContent {
  id: string;
  value: string;
  label: string;
  order: number;
  isActive: boolean;
}

// Equipment Types
export interface EquipmentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  items: EquipmentItem[];
  order: number;
  isActive: boolean;
}

export interface EquipmentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

// Booking Type
export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  eventType: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}