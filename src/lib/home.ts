import { HomeContent } from '@/types';

// Default home content with SEO-optimized content
const defaultHomeContent: HomeContent = {
  stats: [
    {
      id: 'stat-1',
      value: '2.500+',
      label: 'Zufriedene Kunden',
      order: 0,
      isActive: true
    },
    {
      id: 'stat-2', 
      value: '15.000+',
      label: 'Events durchgeführt',
      order: 1,
      isActive: true
    },
    {
      id: 'stat-3',
      value: '50+',
      label: 'Professionelle Mitarbeiter',
      order: 2,
      isActive: true
    },
    {
      id: 'stat-4',
      value: '20+',
      label: 'Jahre Erfahrung',
      order: 3,
      isActive: true
    }
  ],
  seo: {
    title: "FEST'LMACHER Gastronomie | Professionelles Catering in Wien",
    description: "Ihr Partner für erstklassiges Catering in Wien. ✓ 20+ Jahre Erfahrung ✓ 2.500+ zufriedene Kunden ✓ Hochzeiten, Firmenfeiern & Events",
    keywords: "catering wien, event catering, hochzeit catering, firmen catering, party service, buffet service, gourmet catering, festlmacher"
  }
};

// Get home content
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const contentStr = localStorage.getItem('content/home');
    if (contentStr) {
      const content = JSON.parse(contentStr);
      // Merge with default content to ensure all fields exist
      return {
        ...defaultHomeContent,
        ...content,
        stats: content.stats || defaultHomeContent.stats,
        seo: {
          ...defaultHomeContent.seo,
          ...content.seo
        }
      };
    }
    // Save and return default content if none exists
    localStorage.setItem('content/home', JSON.stringify(defaultHomeContent));
    return defaultHomeContent;
  } catch (error) {
    console.error('Error loading home content:', error);
    return defaultHomeContent;
  }
}

// Update home content
export async function updateHomeContent(content: HomeContent): Promise<void> {
  try {
    localStorage.setItem('content/home', JSON.stringify(content));
  } catch (error) {
    console.error('Error updating home content:', error);
    throw error;
  }
}