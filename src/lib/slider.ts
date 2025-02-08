import { v4 as uuidv4 } from 'uuid';
import { SlideContent } from '@/types';
import api from './api';

// Default slides as fallback
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
    title: 'Professionelles Catering',
    subtitle: 'Hochwertige Speisen und erstklassiger Service',
    buttonText: 'Mehr erfahren',
    buttonLink: '/dienstleistungen',
    order: 1,
    showLogo: false,
    isDefault: true
  }
];

// Get all slides including defaults
export const getAllSlides = async (): Promise<SlideContent[]> => {
  try {
    // First try to get slides from localStorage
    const cachedSlides = localStorage.getItem('slides');
    if (cachedSlides) {
      const slides = JSON.parse(cachedSlides);
      if (Array.isArray(slides) && slides.length > 0) {
        return slides;
      }
    }

    // If no cached slides, try to get from API
    const response = await api.get('/slider');
    
    // Validate API response
    if (Array.isArray(response) && response.length > 0) {
      // Cache valid slides
      localStorage.setItem('slides', JSON.stringify(response));
      return response;
    }

    // If API fails or returns empty array, use defaults
    return defaultSlides;
  } catch (error) {
    console.error('Error loading slides:', error);
    // Return defaults on error
    return defaultSlides;
  }
};

// Add new slide
export const addSlide = async (file: File): Promise<SlideContent> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${api.baseUrl}/slider`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to add slide: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Clear slides cache to force refresh
    localStorage.removeItem('slides');
    
    return data.slide;
  } catch (error) {
    console.error('Error adding slide:', error);
    throw error;
  }
};

// Update slide
export const updateSlide = async (slideId: string, updates: Partial<SlideContent>): Promise<void> => {
  try {
    await api.put(`/slider/${slideId}`, updates);
    // Clear slides cache to force refresh
    localStorage.removeItem('slides');
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
};

// Delete slide
export const deleteSlide = async (slideId: string): Promise<void> => {
  try {
    await api.delete(`/slider/${slideId}`);
    // Clear slides cache to force refresh
    localStorage.removeItem('slides');
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};

// Reorder slides
export const reorderSlides = async (slideId: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    await api.patch(`/slider/${slideId}/reorder`, { direction });
    // Clear slides cache to force refresh
    localStorage.removeItem('slides');
  } catch (error) {
    console.error('Error reordering slides:', error);
    throw error;
  }
};