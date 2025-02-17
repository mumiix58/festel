const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('API URL not configured, using default');
    return 'https://festlmacher-api-nucz.onrender.com/api';
  }
  return apiUrl;
};

export const config = {
  apiUrl: getApiUrl(),
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rr4ht3u',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p8czqvd',
    userId: import.meta.env.VITE_EMAILJS_USER_ID || 'GkoX3Rw1QXFuJol9f'
  },
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlilqh3pb',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '762563471959457',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
  }
};

export const baseUrl = config.apiUrl;