// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlilqh3pb';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '762563471959457';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Validate configuration
if (!cloudName || !apiKey || !uploadPreset) {
  console.warn('Some Cloudinary configuration values are using defaults');
}

// Upload image to Cloudinary
export const uploadImage = async (file: File, folder: string = 'general'): Promise<string> => {
  try {
    console.log('Uploading to Cloudinary...', { folder });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    formData.append('api_key', apiKey);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload failed:', error);
      throw new Error(error.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Return a default image URL if upload fails
    return 'https://images.unsplash.com/photo-1555244162-803834f70033';
  }
};

// Get Cloudinary URL with transformations
export const getImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  try {
    const transformations = [];

    if (options.width) {
      transformations.push(`w_${options.width}`);
    }
    if (options.height) {
      transformations.push(`h_${options.height}`);
    }
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }
    if (options.format) {
      transformations.push(`f_${options.format}`);
    }

    // Add default transformations
    transformations.push('c_limit'); // Limit mode
    if (!options.format) {
      transformations.push('f_auto'); // Auto format
    }
    if (!options.quality) {
      transformations.push('q_auto'); // Auto quality
    }

    const transformationString = transformations.join(',');
    const urlParts = url.split('/upload/');
    
    return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error);
    return url;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  if (!cloudName || !apiKey) {
    console.warn('Cloudinary configuration missing for delete operation');
    return;
  }

  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Silently fail deletion to prevent blocking user operations
  }
};

// Generate signature for secure API calls
const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
  const str = `public_id=${publicId}&timestamp=${timestamp}${apiKey}`;
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default {
  uploadImage,
  getImageUrl,
  deleteImage
};