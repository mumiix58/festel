const getApiUrl = () => {
  // Always use the production API URL
  return 'https://festlmacher-api-nucz.onrender.com/api';
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