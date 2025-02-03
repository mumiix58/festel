import api from '../api';
import { AboutContent, FAQContent, HomeContent, ReferencesContent, ServicesPageContent } from '@/types';

// Get content for a specific page
export async function getPageContent(page: string) {
  try {
    const response = await api.get(`/content/${page}`);
    return response.content;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    throw error;
  }
}

// Update content for a specific page
export async function updatePageContent(page: string, content: any) {
  try {
    const response = await api.put(`/content/${page}`, content);
    return response.content;
  } catch (error) {
    console.error(`Error updating ${page} content:`, error);
    throw error;
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