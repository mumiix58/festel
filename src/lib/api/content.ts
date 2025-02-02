import { connectDB } from '../db';
import { AboutContent, FAQContent, HomeContent, ReferencesContent, ServicesPageContent } from '@/types';

interface ContentDocument {
  page: string;
  content: any;
  updatedAt?: Date;
}

// Get content for a specific page
export async function getPageContent(page: string) {
  try {
    const db = await connectDB();
    const content = await db.collection('content').findOne<ContentDocument>({ page });
    return content?.content || null;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    throw error;
  }
}

// Update content for a specific page
export async function updatePageContent(page: string, content: any) {
  try {
    const db = await connectDB();
    await db.collection('content').updateOne(
      { page },
      { $set: { content, updatedAt: new Date() } },
      { upsert: true }
    );
    return content;
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