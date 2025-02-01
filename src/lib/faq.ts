import { v4 as uuidv4 } from 'uuid';
import { FAQContent, FAQItem } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for FAQ
const faqStore = localforage.createInstance({
  name: 'faq',
  storeName: 'content'
});

// Default SEO-optimized FAQ content
const defaultFAQContent: FAQContent = {
  hero: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Service'
  },
  faqs: [
    {
      id: uuidv4(),
      question: 'Wie weit im Voraus sollte ich buchen?',
      answer: 'Wir empfehlen, mindestens 4-6 Wochen im Voraus zu buchen, besonders für größere Veranstaltungen oder in der Hochsaison. Für Hochzeiten empfehlen wir eine Buchung 6-12 Monate im Voraus.',
      order: 0,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Gibt es eine Mindestanzahl an Gästen?',
      answer: 'Ja, für ein vollständiges Catering-Service benötigen wir mindestens 20 Personen. Für kleinere Gruppen bieten wir alternative Lösungen wie Plattenservice oder Fingerfood an.',
      order: 1,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Können Sie spezielle Ernährungsbedürfnisse berücksichtigen?',
      answer: 'Ja, wir bieten verschiedene Optionen für vegetarische, vegane, glutenfreie und andere spezielle Ernährungsbedürfnisse an. Bitte informieren Sie uns bei der Buchung über spezielle Anforderungen.',
      order: 2,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Was ist im Preis enthalten?',
      answer: 'Der Preis beinhaltet in der Regel das Essen, Service-Personal, Geschirr, Besteck und Gläser. Transport und zusätzliche Dienstleistungen werden separat berechnet. Wir erstellen Ihnen gerne ein individuelles Angebot.',
      order: 3,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Bieten Sie Verkostungen an?',
      answer: 'Ja, für Hochzeiten und größere Veranstaltungen bieten wir Verkostungstermine an. Diese können gegen eine kleine Gebühr gebucht werden, die bei Buchung angerechnet wird.',
      order: 4,
      isActive: true
    },
    {
      id: uuidv4(),
      question: 'Was passiert bei einer Stornierung?',
      answer: 'Unsere Stornierungsbedingungen hängen vom Zeitpunkt der Absage und der Art der Veranstaltung ab. Generell gilt: Je früher Sie uns informieren, desto kulanter können wir sein.',
      order: 5,
      isActive: true
    }
  ],
  cta: {
    title: 'Noch Fragen?',
    description: 'Kontaktieren Sie uns gerne für weitere Informationen. Unser Team steht Ihnen zur Verfügung.',
    buttonText: 'Kontakt aufnehmen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Häufig gestellte Fragen (FAQ) | FEST\'LMACHER Catering Wien',
    description: 'Finden Sie Antworten auf häufig gestellte Fragen zu unserem Catering-Service in Wien. ✓ Buchung ✓ Preise ✓ Leistungen ✓ Spezielle Anforderungen',
    keywords: 'catering wien faq, catering fragen, catering antworten, catering informationen, catering service wien'
  }
};

// Get FAQ content
export async function getFAQContent(): Promise<FAQContent> {
  try {
    const content = await faqStore.getItem<FAQContent>('content');
    return content || defaultFAQContent;
  } catch (error) {
    console.error('Error loading FAQ content:', error);
    return defaultFAQContent;
  }
}

// Update FAQ content
export async function updateFAQContent(content: FAQContent): Promise<void> {
  try {
    await faqStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating FAQ content:', error);
    throw new Error('Fehler beim Speichern der FAQ-Inhalte');
  }
}

// Add new FAQ
export async function addFAQ(faq: Omit<FAQItem, 'id' | 'order'>): Promise<FAQItem> {
  try {
    const content = await getFAQContent();
    const newFAQ: FAQItem = {
      ...faq,
      id: uuidv4(),
      order: content.faqs.length
    };
    
    content.faqs.push(newFAQ);
    await updateFAQContent(content);
    return newFAQ;
  } catch (error) {
    console.error('Error adding FAQ:', error);
    throw new Error('Fehler beim Hinzufügen der FAQ');
  }
}

// Update FAQ
export async function updateFAQ(faqId: string, updates: Partial<FAQItem>): Promise<void> {
  try {
    const content = await getFAQContent();
    content.faqs = content.faqs.map(faq =>
      faq.id === faqId ? { ...faq, ...updates } : faq
    );
    await updateFAQContent(content);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw new Error('Fehler beim Aktualisieren der FAQ');
  }
}

// Delete FAQ
export async function deleteFAQ(faqId: string): Promise<void> {
  try {
    const content = await getFAQContent();
    content.faqs = content.faqs
      .filter(faq => faq.id !== faqId)
      .map((faq, index) => ({ ...faq, order: index }));
    await updateFAQContent(content);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw new Error('Fehler beim Löschen der FAQ');
  }
}

// Reorder FAQs
export async function reorderFAQs(faqId: string, newOrder: number): Promise<void> {
  try {
    const content = await getFAQContent();
    const faq = content.faqs.find(f => f.id === faqId);
    if (!faq) return;

    const oldOrder = faq.order;
    content.faqs = content.faqs.map(f => {
      if (f.id === faqId) {
        return { ...f, order: newOrder };
      }
      if (newOrder > oldOrder && f.order <= newOrder && f.order > oldOrder) {
        return { ...f, order: f.order - 1 };
      }
      if (newOrder < oldOrder && f.order >= newOrder && f.order < oldOrder) {
        return { ...f, order: f.order + 1 };
      }
      return f;
    });

    await updateFAQContent(content);
  } catch (error) {
    console.error('Error reordering FAQs:', error);
    throw new Error('Fehler beim Neuordnen der FAQs');
  }
}