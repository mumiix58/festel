import Content from '../models/Content.js';
import Settings from '../models/Settings.js';
import Slider from '../models/Slider.js';
import FAQ from '../models/FAQ.js';
import Service from '../models/Service.js';
import Reference from '../models/Reference.js';
import Equipment from '../models/Equipment.js';
import Legal from '../models/Legal.js';
import { 
  defaultHomeContent,
  defaultAboutContent,
  defaultServicesContent,
  defaultFAQContent,
  defaultReferencesContent
} from '../data/defaultContent.js';

export async function initializeContent() {
  try {
    console.log('Initializing default content in MongoDB...');

    // Initialize Content collection with default content
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
        await Content.create({ page, content });
        console.log(`Default ${page} content initialized`);
      }
    }

    // Initialize default slider content
    const existingSlides = await Slider.countDocuments();
    if (existingSlides === 0) {
      await Slider.create([
        {
          image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
          title: 'Erstklassiges Catering',
          subtitle: 'Für jeden Anlass die perfekte Lösung',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 0,
          showLogo: true,
          isActive: true,
          isDefault: true
        },
        {
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
          title: 'Professionelles Catering',
          subtitle: 'Hochwertige Speisen und erstklassiger Service',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 1,
          showLogo: false,
          isActive: true,
          isDefault: true
        }
      ]);
      console.log('Default slider content initialized');
    }

    // Initialize other content...
    
    console.log('All default content successfully initialized in MongoDB');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}