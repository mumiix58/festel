import api from '../api';
import { AboutContent, FAQContent, HomeContent, ReferencesContent, ServicesPageContent } from '@/types';
import { showToast } from '../toast';

// Get content for a specific page
export async function getPageContent(page: string) {
  try {
    const loadingToast = showToast.loading('Loading content...');
    const response = await api.get(`/content/${page}`);
    
    // Validate response format
    if (!response || (!response.content && !response.data)) {
      showToast.error('Failed to load content');
      throw new Error('Invalid response format from server');
    }

    toast.dismiss(loadingToast);
    showToast.success('Content loaded successfully');
    return response.content || response.data || null;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    showToast.error(`Failed to load ${page} content`);
    throw new Error(error instanceof Error ? error.message : `Failed to fetch ${page} content`);
  }
}

// Update content for a specific page
export async function updatePageContent(page: string, content: any) {
  try {
    const loadingToast = showToast.loading('Saving changes...');
    const response = await api.put(`/content/${page}`, content);
    
    // Validate response format
    if (!response || (!response.content && !response.data)) {
      showToast.error('Failed to save changes');
      throw new Error('Invalid response format from server');
    }

    toast.dismiss(loadingToast);
    showToast.success('Changes saved successfully');
    return response.content || response.data;
  } catch (error) {
    console.error(`Error updating ${page} content:`, error);
    showToast.error(`Failed to save ${page} content`);
    throw new Error(error instanceof Error ? error.message : `Failed to update ${page} content`);
  }
}

// Typed content getters
export async function getHomeContent(): Promise<HomeContent> {
  return getPageContent('home');
}

export async function getAboutContent(): Promise<AboutContent> {
  return getPageContent('about');
}

export async function getFAQContent(): Promise<FAQContent> {
  return getPageContent('faq');
}

export async function getReferencesContent(): Promise<ReferencesContent> {
  return getPageContent('references');
}

export async function getServicesContent(): Promise<ServicesPageContent> {
  return getPageContent('services');
}