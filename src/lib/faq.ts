import { FAQContent } from '@/types';
import api from '@/lib/api';

// Default FAQ content
const defaultFAQContent: FAQContent = {
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

// Get FAQ content from backend with fallback
export async function getFAQContent(): Promise<FAQContent> {
  try {
    const content = await api.get('/content/faq');
    return content || defaultFAQContent;
  } catch (error) {
    console.error('Error loading FAQ content:', error);
    // Return default content as fallback
    return defaultFAQContent;
  }
}

// Update FAQ content with retry mechanism
export async function updateFAQContent(content: FAQContent): Promise<void> {
  try {
    await api.put('/content/faq', content);
  } catch (error) {
    console.error('Error updating FAQ content:', error);
    throw error;
  }
}