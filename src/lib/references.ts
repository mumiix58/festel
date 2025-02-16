import { ReferencesContent } from '@/types';
import api from '@/lib/api';

// Get references content from backend
export async function getReferencesContent(): Promise<ReferencesContent> {
  try {
    const content = await api.get('/content/references');
    return content;
  } catch (error) {
    console.error('Error loading references content:', error);
    throw error;
  }
}

// Update references content
export async function updateReferencesContent(content: ReferencesContent): Promise<void> {
  try {
    await api.put('/content/references', content);
  } catch (error) {
    console.error('Error updating references content:', error);
    throw error;
  }
}