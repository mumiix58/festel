import { ImageContent } from '@/types';
import api from '@/lib/api';
import { optimizeImage } from './imageUtils';
import { uploadImage } from './cloudinary';

// Get all gallery images from backend
export async function getAllGalleryImages(): Promise<ImageContent[]> {
  try {
    console.log('Fetching gallery images...');
    const response = await api.get('/content/gallery/images');
    
    if (response?.content?.images && Array.isArray(response.content.images)) {
      console.log(`Found ${response.content.images.length} gallery images`);
      return response.content.images;
    }
    
    console.log('No gallery images found');
    return [];
  } catch (error) {
    console.error('Error loading gallery images:', error);
    return [];
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
    const id = `gallery-${Date.now()}`;

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

export default {
  getAllGalleryImages,
  addGalleryImage,
  deleteGalleryImage
};