import api from '../api';
import { showToast } from '../toast';

// Generic content fetching function
export async function getPageContent(page: string) {
  try {
    console.log(`Fetching content for page: ${page}`);
    const response = await api.get(`/content/${page}`);
    return response;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    showToast.error(`Failed to load ${page} content`);
    throw error;
  }
}

// Generic content updating function
export async function updatePageContent(page: string, content: any) {
  try {
    console.log(`Updating content for page: ${page}`);
    const response = await api.put(`/content/${page}`, content);
    return response;
  } catch (error) {
    console.error(`Error updating ${page} content:`, error);
    showToast.error(`Failed to save ${page} content`);
    throw error;
  }
}

// Generic section updating function
export async function updatePageSection(page: string, section: string, content: any) {
  try {
    console.log(`Updating section ${section} for page: ${page}`);
    const response = await api.put(`/content/${page}/${section}`, content);
    return response;
  } catch (error) {
    console.error(`Error updating ${page} ${section}:`, error);
    showToast.error(`Failed to save ${section}`);
    throw error;
  }
}