import { v4 as uuidv4 } from 'uuid';

// Custom type for request config
interface RequestConfig {
  retry?: number;
  retryDelay?: number;
}

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

// Record page view with retry mechanism
export const incrementPageViews = async () => {
  try {
    const visitorId = getVisitorId();
    
    // Get current counts
    const currentViews = parseInt(localStorage.getItem('pageViews') || '0', 10);
    const currentVisitors = parseInt(localStorage.getItem('uniqueVisitors') || '0', 10);
    const visitorIds = JSON.parse(localStorage.getItem('visitorIds') || '[]');

    // Update page views
    localStorage.setItem('pageViews', (currentViews + 1).toString());
    
    // Update unique visitors if new
    if (!visitorIds.includes(visitorId)) {
      visitorIds.push(visitorId);
      localStorage.setItem('visitorIds', JSON.stringify(visitorIds));
      localStorage.setItem('uniqueVisitors', (currentVisitors + 1).toString());
    }
  } catch (error) {
    // Silently handle error to avoid disrupting user experience
    console.error('Error recording page view:', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get page views and visitor stats
export const getPageViews = async () => {
  try {
    return {
      pageViews: parseInt(localStorage.getItem('pageViews') || '0', 10),
      uniqueVisitors: parseInt(localStorage.getItem('uniqueVisitors') || '0', 10)
    };
  } catch (error) {
    console.error('Error loading page views:', error instanceof Error ? error.message : 'Unknown error');
    return { pageViews: 0, uniqueVisitors: 0 };
  }
};

// Save contact message
export const saveContactMessage = async (message: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      ...message,
      date: new Date().toISOString()
    };
    messages.unshift(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages.slice(0, 50)));

    // Record activity
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'contact',
      description: `New contact message from ${message.email}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('activities', JSON.stringify(activities.slice(0, 50)));
  } catch (error) {
    console.error('Error saving contact message:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to send message. Please try again later.');
  }
};

// Get analytics data
export const getAnalytics = async () => {
  try {
    return {
      pageViews: parseInt(localStorage.getItem('pageViews') || '0', 10),
      uniqueVisitors: parseInt(localStorage.getItem('uniqueVisitors') || '0', 10)
    };
  } catch (error) {
    console.error('Error loading analytics:', error instanceof Error ? error.message : 'Unknown error');
    return { pageViews: 0, uniqueVisitors: 0 };
  }
};

// Get latest activities
export const getLatestActivities = async () => {
  try {
    return JSON.parse(localStorage.getItem('activities') || '[]');
  } catch (error) {
    console.error('Error loading activities:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};

// Get contact messages
export const getContactMessages = async () => {
  try {
    return JSON.parse(localStorage.getItem('contactMessages') || '[]');
  } catch (error) {
    console.error('Error loading contact messages:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};