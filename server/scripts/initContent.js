import Content from '../models/Content.js';
import { 
  defaultHomeContent,
  defaultAboutContent,
  defaultServicesContent,
  defaultFAQContent,
  defaultReferencesContent
} from '../data/defaultContent.js';

export async function initializeContent() {
  try {
    console.log('Checking and initializing content...');
    
    const contentTypes = [
      { page: 'home', content: defaultHomeContent },
      { page: 'about', content: defaultAboutContent },
      { page: 'services', content: defaultServicesContent },
      { page: 'faq', content: defaultFAQContent },
      { page: 'references', content: defaultReferencesContent }
    ];

    for (const { page, content } of contentTypes) {
      const existingContent = await Content.findOne({ page });
      
      if (!existingContent) {
        console.log(`Initializing default ${page} content...`);
        await Content.create({ page, content });
        console.log(`Default ${page} content created successfully`);
      }
    }

    console.log('Content initialization completed');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}