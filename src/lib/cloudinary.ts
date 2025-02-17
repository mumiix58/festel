// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlilqh3pb';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '762563471959457';
const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'J49GcglEgkV9bFeOeXc459GRfzE';

// Validate configuration
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary configuration is incomplete');
}

// Upload image to Cloudinary
export const uploadImage = async (file: File, folder: string = 'general'): Promise<string> => {
  try {
    console.log('Starting Cloudinary upload...', { folder });
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(`folder=${folder}&timestamp=${timestamp}`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

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
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data);
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    console.log('Deleting from Cloudinary:', publicId);
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(`public_id=${publicId}&timestamp=${timestamp}`);

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

    console.log('Image deleted successfully from Cloudinary');
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Generate signature for secure API calls
const generateSignature = async (paramsToSign: string): Promise<string> => {
  const str = paramsToSign + apiSecret;
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default {
  uploadImage,
  deleteImage
};