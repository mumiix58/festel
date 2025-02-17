import imageCompression from 'browser-image-compression';
import { config } from './config';

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
    console.log('Optimizing image...', {
      originalSize: file.size / 1024 / 1024,
      originalType: file.type
    });
    
    const compressedFile = await imageCompression(file, options);
    
    console.log('Image optimized', {
      finalSize: compressedFile.size / 1024 / 1024,
      finalType: compressedFile.type
    });
    
    return compressedFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Return original file if optimization fails
    return file;
  }
}

// Upload image with retry mechanism
export async function uploadImageWithRetry(
  file: File,
  folder: string = 'general',
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First optimize the image
      const optimizedFile = await optimizeImage(file);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', optimizedFile);
      formData.append('upload_preset', config.cloudinary.uploadPreset);
      formData.append('folder', folder);
      formData.append('api_key', config.cloudinary.apiKey);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('All upload attempts failed');
  throw lastError || new Error('Failed to upload image after multiple attempts');
}

// Delete image with retry
export async function deleteImageWithRetry(
  publicId: string,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', config.cloudinary.apiKey);
      formData.append('timestamp', Date.now().toString());

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }

      return;
    } catch (error) {
      console.error(`Delete attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('All delete attempts failed');
  throw lastError || new Error('Failed to delete image after multiple attempts');
}

export default {
  optimizeImage,
  uploadImageWithRetry,
  deleteImageWithRetry
};