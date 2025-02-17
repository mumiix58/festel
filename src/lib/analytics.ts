import { v4 as uuidv4 } from 'uuid';
import api from './api';

// Get visitor ID from cookie or create new one
const getVisitorId = () => {
  try {
    let visitorId = document.cookie.match(/visitorId=([^;]+)/)?.[1];
    if (!visitorId) {
      visitorId = uuidv4();
      document.cookie = `visitorId=${visitorId};path=/;max-age=31536000`; // 1 year
    }
    return visitorId;
  } catch (error) {
    // Fallback to random ID if cookie access fails
    return uuidv4();
  }
};

// Record page view
export const incrementPageViews = async () => {
  try {
    const visitorId = getVisitorId();
    await api.post('/analytics/pageview', { visitorId });
  } catch (error) {
    // Silently handle error to avoid disrupting user experience
    console.error('Error recording page view:', error);
  }
};

// Get analytics data
export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics/stats');
    return response || { pageViews: 0, uniqueVisitors: 0 };
  } catch (error) {
    console.error('Error loading analytics:', error);
    return { pageViews: 0, uniqueVisitors: 0 };
  }
};

// Get latest activities
export const getLatestActivities = async () => {
  try {
    const response = await api.get('/analytics/activities');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error loading activities:', error);
    return [];
  }
};

// Save contact message
export const saveContactMessage = async (message: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    await api.post('/analytics/contact', message);
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw new Error('Failed to send message. Please try again later.');
  }
};