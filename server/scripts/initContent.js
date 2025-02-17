// Add to the existing imports at the top
import Content from '../models/Content.js';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import Slider from '../models/Slider.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add this function after the existing imports
async function initializeSlider() {
  try {
    console.log('Checking for existing slides...');
    const count = await Slider.countDocuments();
    
    if (count === 0) {
      console.log('No slides found. Creating defaults...');
      
      const defaultSlides = [
        {
          title: 'Erstklassiges Catering',
          subtitle: 'Für jeden Anlass die perfekte Lösung',
          image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 0,
          showLogo: true,
          isActive: true
        },
        {
          title: 'Hochzeits-Catering',
          subtitle: 'Machen Sie Ihren besonderen Tag unvergesslich',
          image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 1,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Business Catering',
          subtitle: 'Professioneller Service für Ihre Firmenveranstaltung',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 2,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Event Catering',
          subtitle: 'Unvergessliche Momente mit perfektem Service',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 3,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Gourmet Catering',
          subtitle: 'Erstklassige Küche für höchste Ansprüche',
          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
          buttonText: 'Kontaktieren Sie uns',
          buttonLink: '/kontakt',
          order: 4,
          showLogo: true,
          isActive: true
        },
        {
          title: 'Nachhaltiges Catering',
          subtitle: 'Verantwortungsvoll genießen',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
          buttonText: 'Erfahren Sie mehr',
          buttonLink: '/bio-nachhaltigkeit',
          order: 5,
          showLogo: false,
          isActive: true
        }
      ];

      // Upload images to Cloudinary and create slides
      for (const slideData of defaultSlides) {
        try {
          // Upload image to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(slideData.image, {
            folder: 'slider',
            resource_type: 'image'
          });

          // Create slide with Cloudinary URL
          await Slider.create({
            ...slideData,
            image: uploadResponse.secure_url,
            cloudinaryPublicId: uploadResponse.public_id
          });

          console.log(`Created slide: ${slideData.title}`);
        } catch (error) {
          console.error(`Error creating slide ${slideData.title}:`, error);
        }
      }

      console.log('Default slides initialized');
    } else {
      console.log(`Found ${count} existing slides`);
    }
  } catch (error) {
    console.error('Error initializing slides:', error);
  }
}

// Rest of the file remains the same...
// Just add the initializeSlider call in the initializeContent function

export async function initializeContent() {
  try {
    console.log('Initializing default content...');

    // Initialize slides first
    await initializeSlider();

    // Rest of the initialization code...
    const contentPages = [
      { page: 'about', content: defaultAboutContent },
      { page: 'faq', content: defaultFAQContent },
      { page: 'references', content: defaultReferencesContent },
      { page: 'footer', content: defaultFooterContent },
      { page: 'home', content: defaultHomeContent },
      { page: 'services', content: defaultServicesContent },
      { page: 'equipment', content: defaultEquipmentContent },
      { page: 'legal', content: defaultLegalContent }
    ];

    // Initialize each content page
    for (const { page, content } of contentPages) {
      const existingContent = await Content.findOne({ page });
      if (!existingContent) {
        await Content.create({ page, content });
        console.log(`Default ${page} content initialized`);
      }
    }

    console.log('Content initialization complete');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}