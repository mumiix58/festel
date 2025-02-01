import { SlideContent } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for slider
const sliderStore = localforage.createInstance({
  name: 'slider',
  storeName: 'slides'
});

// Default slides to use while loading or on error
const defaultSlides: SlideContent[] = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
    title: 'Erstklassiges Catering',
    subtitle: 'Für jeden Anlass die perfekte Lösung',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt',
    order: 0,
    showLogo: true,
    isDefault: true
  },
  {
    id: 'default-2', 
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    title: '30 Jahre FEST\'LMACHER',
    subtitle: 'Drei Jahrzehnte kulinarische Exzellenz und perfekter Service',
    buttonText: 'Unsere Geschichte',
    buttonLink: '/uber-uns',
    order: 1,
    showLogo: false,
    isDefault: true
  }
];

// Get all slides including defaults
export const getAllSlides = async (): Promise<SlideContent[]> => {
  try {
    const customSlides = await getCustomSlides();
    return [...defaultSlides, ...customSlides].sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading slides');
    // Return default slides on error
    return defaultSlides;
  }
};

// Get only custom slides
const getCustomSlides = async (): Promise<SlideContent[]> => {
  try {
    const slides = await sliderStore.getItem<SlideContent[]>('slides');
    return slides?.filter(slide => !slide.isDefault) || [];
  } catch (error) {
    console.error('Error loading custom slides');
    return [];
  }
};

// Add new slide
export const addSlide = async (file: File): Promise<SlideContent> => {
  try {
    const reader = new FileReader();
    const allSlides = await getAllSlides();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const newSlide: SlideContent = {
            id: `slide-${Date.now()}`,
            image: reader.result as string,
            title: 'Neuer Slide',
            subtitle: 'Slide Beschreibung',
            buttonText: 'Jetzt anfragen',
            buttonLink: '/kontakt',
            order: allSlides.length,
            showLogo: true,
            isDefault: false
          };
          
          const customSlides = await getCustomSlides();
          await sliderStore.setItem('slides', [...customSlides, newSlide]);
          resolve(newSlide);
        } catch (error) {
          reject(new Error('Failed to save slide'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error adding slide');
    throw new Error('Failed to add slide');
  }
};

// Update slide
export const updateSlide = async (slideId: string, updates: Partial<SlideContent>): Promise<void> => {
  try {
    const customSlides = await getCustomSlides();
    const updatedSlides = customSlides.map(slide =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    );
    await sliderStore.setItem('slides', updatedSlides);
  } catch (error) {
    console.error('Error updating slide');
    throw new Error('Failed to update slide');
  }
};

// Delete slide
export const deleteSlide = async (slideId: string): Promise<void> => {
  try {
    const customSlides = await getCustomSlides();
    const updatedSlides = customSlides.filter(slide => slide.id !== slideId);
    await sliderStore.setItem('slides', updatedSlides);
  } catch (error) {
    console.error('Error deleting slide');
    throw new Error('Failed to delete slide');
  }
};

// Reorder slides
export const reorderSlides = async (slideId: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    const allSlides = await getAllSlides();
    const currentIndex = allSlides.findIndex(slide => slide.id === slideId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= allSlides.length) return;
    
    const customSlides = await getCustomSlides();
    const updatedSlides = customSlides.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, order: newIndex };
      }
      if (slide.order === newIndex) {
        return { ...slide, order: currentIndex };
      }
      return slide;
    });
    
    await sliderStore.setItem('slides', updatedSlides);
  } catch (error) {
    console.error('Error reordering slides');
    throw new Error('Failed to reorder slides');
  }
};