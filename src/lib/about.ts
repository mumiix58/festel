import { AboutContent } from '@/types';
import api from '@/lib/api';

// Get about content from backend
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const content = await api.get('/content/about');
    return content;
  } catch (error) {
    console.error('Error loading about content:', error);
    throw error;
  }
}

// Update about content
export async function updateAboutContent(content: AboutContent): Promise<void> {
  try {
    await api.put('/content/about', content);
  } catch (error) {
    console.error('Error updating about content:', error);
    throw error;
  }
}