export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rr4ht3u',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p8czqvd',
    userId: import.meta.env.VITE_EMAILJS_USER_ID || 'GkoX3Rw1QXFuJol9f'
  },
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  },
  mongodb: {
    uri: import.meta.env.MONGODB_URI || 'mongodb+srv://gey14853:Muhammed5858@festelmacher.egk1s.mongodb.net/?retryWrites=true&w=majority&appName=festelmacher'
  }
};

export const baseUrl = config.apiUrl;