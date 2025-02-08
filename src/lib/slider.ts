import { SlideContent } from '@/types';
import api from './api';

// Get all slides
export const getAllSlides = async (): Promise<SlideContent[]> => {
  try {
    const response = await api.get('/slider');
    return response || [];
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

    const response = await fetch(`${api.baseUrl}/slider`, {
      method: 'POST',
      body: formData,
      headers: api.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to add slide: ${response.statusText}`);
    }

    const data = await response.json();
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