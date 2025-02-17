import imageCompression from 'browser-image-compression';
import { uploadImage, getImageUrl } from './cloudinary';

const MAX_IMAGE_SIZE = 2; // Maximum image size in MB
const MAX_IMAGE_DIMENSION = 1920; // Maximum width/height in pixels
const COMPRESSION_QUALITY = 0.8; // Image compression quality

// Optimize image for web
export async function optimizeImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: MAX_IMAGE_SIZE,
    maxWidthOrHeight: MAX_IMAGE_DIMENSION,
    useWebWorker: true,
    fileType: 'image/webp',
    quality: COMPRESSION_QUALITY
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw new Error('Failed to optimize image');
  }
}

// Upload image to storage
export async function uploadImageToStorage(file: File, folder: string = 'general'): Promise<string> {
  try {
    const optimizedFile = await optimizeImage(file);
    const imageUrl = await uploadImage(optimizedFile, folder);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

// Get optimized image URL
export function getOptimizedImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string {
  return getImageUrl(url, options);
}

export default {
  optimizeImage,
  uploadImageToStorage,
  getOptimizedImageUrl
};