import { v4 as uuidv4 } from 'uuid';
import { ReferencesContent, TestimonialContent } from '@/types';
import localforage from 'localforage';
import { optimizeImage } from './imageUtils';

// Initialize localforage instance for references
const referencesStore = localforage.createInstance({
  name: 'references',
  storeName: 'content'
});

// Default SEO-optimized references content
const defaultReferencesContent: ReferencesContent = {
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
      quote: 'Das Catering war absolut erstklassig. Unsere Gäste schwärmen heute noch von dem Essen!',
      rating: 5,
      order: 0,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Technik GmbH',
      event: 'Firmenfeier',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      quote: 'Professioneller Service und hervorragendes Essen. Perfekt für unsere Firmenveranstaltung.',
      rating: 5,
      order: 1,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Familie Müller',
      event: 'Geburtstag',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      quote: 'Wunderbare Zusammenarbeit und ein unvergessliches Buffet. Sehr zu empfehlen!',
      rating: 5,
      order: 2,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Marketing Solutions',
      event: 'Produktlaunch',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      quote: 'Innovative Präsentation und erstklassiger Service. Genau das, was wir gesucht haben!',
      rating: 5,
      order: 3,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Sarah & Thomas',
      event: 'Hochzeit',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      quote: 'Ein Traum von Hochzeit mit perfektem Catering. Danke für diesen wundervollen Tag!',
      rating: 5,
      order: 4,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'IT Systems AG',
      event: 'Firmenjubiläum',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
      quote: 'Großartiges Catering für über 200 Gäste. Perfekte Organisation und Durchführung.',
      rating: 5,
      order: 5,
      isActive: true
    }
  ],
  cta: {
    title: 'Werden Sie unser nächster zufriedener Kunde',
    description: 'Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch und lassen Sie uns gemeinsam Ihre Veranstaltung planen.',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  },
  seo: {
    title: 'Referenzen & Kundenstimmen | FEST\'LMACHER Catering Wien',
    description: 'Entdecken Sie, was unsere Kunden über unseren Catering-Service in Wien sagen. ✓ Hochzeiten ✓ Firmenfeiern ✓ Private Events',
    keywords: 'catering wien referenzen, catering bewertungen, catering erfahrungen, catering kundenstimmen'
  }
};

// Get references content
export async function getReferencesContent(): Promise<ReferencesContent> {
  try {
    const content = await referencesStore.getItem<ReferencesContent>('content');
    return content || defaultReferencesContent;
  } catch (error) {
    console.error('Error loading references content:', error);
    return defaultReferencesContent;
  }
}

// Update references content
export async function updateReferencesContent(content: ReferencesContent): Promise<void> {
  try {
    await referencesStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating references content:', error);
    throw new Error('Fehler beim Speichern der Referenzen');
  }
}

// Add new testimonial
export async function addTestimonial(testimonial: Omit<TestimonialContent, 'id' | 'order'>): Promise<TestimonialContent> {
  try {
    const content = await getReferencesContent();
    const newTestimonial: TestimonialContent = {
      ...testimonial,
      id: uuidv4(),
      order: content.testimonials.length
    };
    
    content.testimonials.push(newTestimonial);
    await updateReferencesContent(content);
    return newTestimonial;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw new Error('Fehler beim Hinzufügen der Referenz');
  }
}

// Update testimonial
export async function updateTestimonial(testimonialId: string, updates: Partial<TestimonialContent>): Promise<void> {
  try {
    const content = await getReferencesContent();
    content.testimonials = content.testimonials.map(testimonial =>
      testimonial.id === testimonialId ? { ...testimonial, ...updates } : testimonial
    );
    await updateReferencesContent(content);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Fehler beim Aktualisieren der Referenz');
  }
}

// Delete testimonial
export async function deleteTestimonial(testimonialId: string): Promise<void> {
  try {
    const content = await getReferencesContent();
    content.testimonials = content.testimonials
      .filter(testimonial => testimonial.id !== testimonialId)
      .map((testimonial, index) => ({ ...testimonial, order: index }));
    await updateReferencesContent(content);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw new Error('Fehler beim Löschen der Referenz');
  }
}

// Reorder testimonials
export async function reorderTestimonials(testimonialId: string, newOrder: number): Promise<void> {
  try {
    const content = await getReferencesContent();
    const testimonial = content.testimonials.find(t => t.id === testimonialId);
    if (!testimonial) return;

    const oldOrder = testimonial.order;
    content.testimonials = content.testimonials.map(t => {
      if (t.id === testimonialId) {
        return { ...t, order: newOrder };
      }
      if (newOrder > oldOrder && t.order <= newOrder && t.order > oldOrder) {
        return { ...t, order: t.order - 1 };
      }
      if (newOrder < oldOrder && t.order >= newOrder && t.order < oldOrder) {
        return { ...t, order: t.order + 1 };
      }
      return t;
    });

    await updateReferencesContent(content);
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    throw new Error('Fehler beim Neuordnen der Referenzen');
  }
}

// Update testimonial image
export async function updateTestimonialImage(testimonialId: string, file: File): Promise<string> {
  try {
    const optimizedFile = await optimizeImage(file);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageUrl = reader.result as string;
          await updateTestimonial(testimonialId, { image: imageUrl });
          resolve(imageUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(optimizedFile);
    });
  } catch (error) {
    console.error('Error updating testimonial image:', error);
    throw new Error('Fehler beim Aktualisieren des Bildes');
  }
}