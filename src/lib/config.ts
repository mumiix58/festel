const getApiUrl = () => {
  // Remove /api since we'll add it in the proxy config
  return 'https://festlmacher-api-nucz.onrender.com';
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