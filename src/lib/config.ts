const getApiUrl = () => {
  // In development, use the proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production, use the Render API URL
  return import.meta.env.VITE_API_URL || 'https://festlmacher-api-nucz.onrender.com/api';
};

export const config = {
  apiUrl: getApiUrl(),
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rr4ht3u',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p8czqvd',
    userId: import.meta.env.VITE_EMAILJS_USER_ID || 'GkoX3Rw1QXFuJol9f'
  },
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  }
};

export const baseUrl = config.apiUrl;