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
    console.log('Fetching slides from server...');
    const response = await api.get('/slider');
    
    // Check if response exists and is valid
    if (!response) {
      console.warn('No response from server, using defaults');
      return defaultSlides;
    }

    // Handle both array and object responses
    const slides = Array.isArray(response) ? response : response.data || [];
    console.log('Received slides from server:', slides);

    // Validate slides array
    if (!Array.isArray(slides)) {
      console.warn('Invalid response format (not an array), using defaults');
      return defaultSlides;
    }

    // If no slides in database, use defaults
    if (slides.length === 0) {
      console.warn('No slides found in database, using defaults');
      return defaultSlides;
    }

    // Ensure all required fields are present
    const validSlides = slides.every(slide => 
      slide.id && 
      slide.image && 
      slide.title && 
      slide.subtitle && 
      typeof slide.order === 'number'
    );

    if (!validSlides) {
      console.warn('Invalid slide data format, using defaults');
      return defaultSlides;
    }

    console.log('Successfully loaded slides:', slides);
    return slides;
  } catch (error) {
    console.error('Error loading slides:', error);
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
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to add slide: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.slide) {
      throw new Error('Invalid response format: missing slide data');
    }

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
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
};

// Delete slide
export const deleteSlide = async (slideId: string): Promise<void> => {
  try {
    await api.delete(`/slider/${slideId}`);
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};

// Reorder slides
export const reorderSlides = async (slideId: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    await api.patch(`/slider/${slideId}/reorder`, { direction });
  } catch (error) {
    console.error('Error reordering slides:', error);
    throw error;
  }
};