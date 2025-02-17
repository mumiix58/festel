import { v4 as uuidv4 } from 'uuid';
import { ImageContent } from '@/types';
import { optimizeImage } from './imageUtils';
import { uploadImage, deleteImage } from './cloudinary';
import api from './api';

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
  }
];

// Get all gallery images from backend
export async function getAllGalleryImages(): Promise<ImageContent[]> {
  try {
    console.log('Fetching gallery images...');
    const response = await api.get('/content/gallery/images');
    
    // If we have a valid response with images, return them
    if (response?.content?.images && Array.isArray(response.content.images)) {
      console.log(`Found ${response.content.images.length} gallery images`);
      return response.content.images;
    }
    
    console.log('No gallery images found, returning defaults');
    return defaultGalleryImages;
  } catch (error) {
    console.error('Error loading gallery images:', error);
    return defaultGalleryImages;
  }
}

// Add new image to gallery
export async function addGalleryImage(file: File): Promise<ImageContent> {
  try {
    console.log('Adding new gallery image...');
    
    // 1. Optimize image
    const optimizedFile = await optimizeImage(file);
    console.log('Image optimized');
    
    // 2. Upload to Cloudinary
    const imageUrl = await uploadImage(optimizedFile, 'gallery');
    console.log('Image uploaded to Cloudinary:', imageUrl);
    
    // 3. Generate SEO-friendly title from filename
    const baseTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    const title = `Catering Wien - ${baseTitle}`;
    const id = `gallery-${uuidv4()}`;

    // 4. Create image content
    const image: ImageContent = {
      id,
      url: imageUrl,
      alt: `Catering Service Wien - ${title}`,
      title
    };

    // 5. Save to backend
    const response = await api.post('/content/gallery/images', { image });
    
    if (!response) {
      throw new Error('Failed to save image metadata');
    }

    console.log('Gallery image added successfully');
    return image;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw new Error('Failed to add image to gallery');
  }
}

// Delete image from gallery
export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    console.log('Deleting gallery image:', id);
    
    // 1. Get image details
    const images = await getAllGalleryImages();
    const image = images.find(img => img.id === id);
    
    if (!image) {
      throw new Error('Image not found');
    }

    // 2. Delete from Cloudinary if it's a Cloudinary URL
    if (image.url.includes('cloudinary.com')) {
      const publicId = image.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteImage(`gallery/${publicId}`);
      }
    }

    // 3. Delete from backend
    const response = await api.delete(`/content/gallery/images/${id}`);
    
    if (!response) {
      throw new Error('Failed to delete image');
    }
    
    console.log('Gallery image deleted successfully');
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw new Error('Failed to delete image from gallery');
  }
}

// Update image metadata
export async function updateImageMetadata(id: string, updates: Partial<ImageContent>): Promise<void> {
  try {
    console.log('Updating image metadata:', id);
    const response = await api.put(`/content/gallery/images/${id}`, updates);
    
    if (!response) {
      throw new Error('Failed to update image metadata');
    }
    console.log('Image metadata updated successfully');
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw new Error('Failed to update image information');
  }
}

export default {
  getAllGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  updateImageMetadata
};