import imageCompression from 'browser-image-compression';

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
export async function uploadImageToStorage(file: File): Promise<string> {
  try {
    const optimizedFile = await optimizeImage(file);
    
    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(optimizedFile);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}