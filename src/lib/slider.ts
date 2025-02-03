import { SlideContent } from '@/types';
import api from './api';
import { showToast } from './toast';

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
    showToast.loading('Loading slides...');
    
    // First try to get slides from API
    const response = await api.get('/slider');
    
    // Validate response format
    if (!response || (!Array.isArray(response) && !Array.isArray(response.data))) {
      console.warn('Invalid response format from API, using default slides');
      showToast.error('Failed to load slides from server, using defaults');
      return defaultSlides;
    }

    // Handle both response formats
    const slides = Array.isArray(response) ? response : response.data || [];
    
    // If no slides returned, use defaults
    if (slides.length === 0) {
      console.warn('No slides returned from API, using default slides');
      showToast.error('No slides found, using defaults');
      return defaultSlides;
    }

    showToast.success('Slides loaded successfully');
    return slides;
  } catch (error) {
    console.warn('Error loading slides from API, using default slides:', error);
    showToast.error('Failed to load slides from server, using defaults');
    return defaultSlides;
  }
};

// Add new slide
export const addSlide = async (file: File): Promise<SlideContent> => {
  showToast.loading('Uploading slide...');
  
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
    
    if (!data.slide) {
      throw new Error('Invalid response format: missing slide data');
    }

    showToast.success('Slide added successfully');
    return data.slide;
  } catch (error) {
    console.error('Error adding slide:', error);
    showToast.error('Failed to add slide');
    throw new Error(error instanceof Error ? error.message : 'Failed to add slide');
  }
};

// Update slide
export const updateSlide = async (slideId: string, updates: Partial<SlideContent>): Promise<void> => {
  showToast.loading('Updating slide...');
  
  try {
    const response = await api.put(`/slider/${slideId}`, updates);
    
    if (!response || !response.message) {
      throw new Error('Invalid response format from server');
    }

    showToast.success('Slide updated successfully');
  } catch (error) {
    console.error('Error updating slide:', error);
    showToast.error('Failed to update slide');
    throw new Error(error instanceof Error ? error.message : 'Failed to update slide');
  }
};

// Delete slide
export const deleteSlide = async (slideId: string): Promise<void> => {
  showToast.loading('Deleting slide...');
  
  try {
    const response = await api.delete(`/slider/${slideId}`);
    
    if (!response || !response.message) {
      throw new Error('Invalid response format from server');
    }

    showToast.success('Slide deleted successfully');
  } catch (error) {
    console.error('Error deleting slide:', error);
    showToast.error('Failed to delete slide');
    throw new Error(error instanceof Error ? error.message : 'Failed to delete slide');
  }
};

// Reorder slides
export const reorderSlides = async (slideId: string, direction: 'up' | 'down'): Promise<void> => {
  showToast.loading('Reordering slides...');
  
  try {
    const response = await api.patch(`/slider/${slideId}/reorder`, { direction });
    
    if (!response || !response.message) {
      throw new Error('Invalid response format from server');
    }

    showToast.success('Slides reordered successfully');
  } catch (error) {
    console.error('Error reordering slides:', error);
    showToast.error('Failed to reorder slides');
    throw new Error(error instanceof Error ? error.message : 'Failed to reorder slides');
  }
};