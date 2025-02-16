import { HomeContent } from '@/types';
import api from '@/lib/api';

// Get home content from backend
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const content = await api.get('/content/home');
    return content;
  } catch (error) {
    console.error('Error loading home content:', error);
    throw error;
  }
}

// Update home content
export async function updateHomeContent(content: HomeContent): Promise<void> {
  try {
    await api.put('/content/home', content);
  } catch (error) {
    console.error('Error updating home content:', error);
    throw error;
  }
}