import { SlideContent } from '@/types';
import api from '@/lib/api';
import { optimizeImage } from './imageUtils';
import { v4 as uuidv4 } from 'uuid';

// Get all slides from backend with fallback
export const getAllSlides = async (): Promise<SlideContent[]> => {
  try {
    const response = await api.get('/content/slider');
    if (response?.content?.slides) {
      return response.content.slides;
    }
    return [];
  } catch (error) {
    console.error('Error loading slides:', error);
    return [];
  }
};

// Add new slide
export const addSlide = async (file: File): Promise<SlideContent> => {
  try {
    const optimizedFile = await optimizeImage(file);
    const reader = new FileReader();
    
    const imageUrl = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(optimizedFile);
    });

    const slides = await getAllSlides();
    
    const newSlide: SlideContent = {
      id: `slide-${uuidv4()}`,
      image: imageUrl,
      title: 'Neuer Slide',
      subtitle: 'Slide Beschreibung',
      buttonText: 'Jetzt anfragen',
      buttonLink: '/kontakt',
      order: slides.length,
      showLogo: false
    };

    const updatedSlides = [...slides, newSlide];
    
    const response = await api.put('/content/slider', {
      slides: updatedSlides
    });

    if (!response) {
      throw new Error('Failed to add slide');
    }

    return newSlide;
  } catch (error) {
    console.error('Error adding slide:', error);
    throw error;
  }
};

// Update slide
export const updateSlide = async (slideId: string, updates: Partial<SlideContent>): Promise<void> => {
  try {
    const slides = await getAllSlides();
    const updatedSlides = slides.map(slide =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    );

    const response = await api.put('/content/slider', {
      slides: updatedSlides
    });

    if (!response) {
      throw new Error('Failed to update slide');
    }
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
};

// Delete slide
export const deleteSlide = async (slideId: string): Promise<void> => {
  try {
    const slides = await getAllSlides();
    const updatedSlides = slides
      .filter(slide => slide.id !== slideId)
      .map((slide, index) => ({ ...slide, order: index }));

    const response = await api.put('/content/slider', {
      slides: updatedSlides
    });

    if (!response) {
      throw new Error('Failed to delete slide');
    }
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};

// Reorder slides
export const reorderSlides = async (slideId: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    const slides = await getAllSlides();
    const currentIndex = slides.findIndex(s => s.id === slideId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(currentIndex, 1);
    updatedSlides.splice(newIndex, 0, movedSlide);

    // Update order values
    const reorderedSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      order: index
    }));

    const response = await api.put('/content/slider', {
      slides: reorderedSlides
    });

    if (!response) {
      throw new Error('Failed to reorder slides');
    }
  } catch (error) {
    console.error('Error reordering slides:', error);
    throw error;
  }
};