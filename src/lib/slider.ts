import { SlideContent } from '@/types';
import api from './api';
import { uploadImageWithRetry } from './imageUtils';

// Get all slides from backend
export const getAllSlides = async (): Promise<SlideContent[]> => {
  try {
    console.log('Fetching slides...');
    const response = await api.get('/slider');
    
    if (Array.isArray(response)) {
      console.log(`Found ${response.length} slides`);
      return response.map(slide => ({
        id: slide._id,
        image: slide.image,
        title: slide.title,
        subtitle: slide.subtitle,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        order: slide.order,
        showLogo: slide.showLogo,
        isActive: slide.isActive
      }));
    }
    
    console.log('No slides found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error loading slides:', error);
    return [];
  }
};

// Add new slide
export const addSlide = async (file: File): Promise<SlideContent> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', 'New Slide');
    formData.append('subtitle', 'Slide Description');
    formData.append('buttonText', 'Learn More');
    formData.append('buttonLink', '/contact');
    formData.append('showLogo', 'false');

    const response = await api.post('/slider', formData);
    
    if (!response?.slide) {
      throw new Error('Failed to create slide');
    }

    return {
      id: response.slide._id,
      image: response.slide.image,
      title: response.slide.title,
      subtitle: response.slide.subtitle,
      buttonText: response.slide.buttonText,
      buttonLink: response.slide.buttonLink,
      order: response.slide.order,
      showLogo: response.slide.showLogo,
      isActive: response.slide.isActive
    };
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