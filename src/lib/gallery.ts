import { v4 as uuidv4 } from 'uuid';
import { ImageContent } from '@/types';
import localforage from 'localforage';
import { optimizeImage } from './imageUtils';

// Initialize localforage instance for gallery
const galleryStore = localforage.createInstance({
  name: 'gallery',
  storeName: 'images'
});

// Default gallery images with SEO-friendly names and descriptions
const defaultGalleryImages: ImageContent[] = [
  {
    id: `premium-catering-service-wien-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1555244162-803834f70033',
    alt: 'Premium Catering Service Wien mit exklusiver Präsentation',
    title: 'Premium Catering Service Wien',
    isDefault: true
  },
  {
    id: `hochzeits-catering-service-wien-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    alt: 'Hochzeits-Catering Service Wien mit exquisiten Speisen',
    title: 'Hochzeits-Catering Service Wien',
    isDefault: true
  },
  {
    id: `business-event-catering-wien-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    alt: 'Business Event Catering Wien für Firmenveranstaltungen',
    title: 'Business Event Catering Wien',
    isDefault: true
  },
  {
    id: `gala-dinner-catering-service-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
    alt: 'Gala Dinner Catering Service mit eleganter Präsentation',
    title: 'Gala Dinner Catering Service',
    isDefault: true
  },
  {
    id: `outdoor-event-catering-wien-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
    alt: 'Outdoor Event Catering Wien für Veranstaltungen',
    title: 'Outdoor Event Catering Wien',
    isDefault: true
  },
  {
    id: `premium-buffet-service-wien-${uuidv4()}`,
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    alt: 'Premium Buffet Service Wien für besondere Anlässe',
    title: 'Premium Buffet Service Wien',
    isDefault: true
  }
];

// Generate SEO-friendly ID for images
function generateImageId(title: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0];
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
  return `catering-${sanitizedTitle}-${timestamp}-${uuid}`;
}

// Get all gallery images including defaults
export async function getAllGalleryImages(): Promise<ImageContent[]> {
  try {
    const customImages = await getCustomGalleryImages();
    return [...defaultGalleryImages, ...customImages];
  } catch (error) {
    console.error('Error loading gallery images:', error);
    return defaultGalleryImages;
  }
}

// Get only custom uploaded images
export async function getCustomGalleryImages(): Promise<ImageContent[]> {
  try {
    const keys = await galleryStore.keys();
    const images: ImageContent[] = [];

    for (const key of keys) {
      if (key.startsWith('image_')) {
        const image = await galleryStore.getItem<ImageContent>(key);
        if (image) {
          images.push(image);
        }
      }
    }

    return images;
  } catch (error) {
    console.error('Error loading custom images:', error);
    return [];
  }
}

// Add new image to gallery
export async function addGalleryImage(file: File): Promise<ImageContent> {
  try {
    const optimizedFile = await optimizeImage(file);
    
    // Generate SEO-friendly title from filename
    const baseTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    const title = `Catering Wien - ${baseTitle}`;
    const id = generateImageId(title);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const image: ImageContent = {
            id,
            url: reader.result as string,
            alt: `Catering Service Wien - ${title}`,
            title
          };
          
          await galleryStore.setItem(`image_${id}`, image);
          resolve(image);
        } catch (error) {
          reject(new Error('Fehler beim Speichern des Bildes'));
        }
      };
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen des Bildes'));
      reader.readAsDataURL(optimizedFile);
    });
  } catch (error) {
    throw new Error('Fehler beim Verarbeiten des Bildes');
  }
}

// Replace existing image
export async function replaceGalleryImage(id: string, file: File): Promise<ImageContent> {
  await deleteGalleryImage(id);
  return addGalleryImage(file);
}

// Delete image from gallery
export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    await galleryStore.removeItem(`image_${id}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Fehler beim Löschen des Bildes');
  }
}

// Update image metadata
export async function updateImageMetadata(id: string, updates: Partial<ImageContent>): Promise<void> {
  try {
    const image = await galleryStore.getItem<ImageContent>(`image_${id}`);
    if (image) {
      await galleryStore.setItem(`image_${id}`, { ...image, ...updates });
    }
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw new Error('Fehler beim Aktualisieren der Bildinformationen');
  }
}