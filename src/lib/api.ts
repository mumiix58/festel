const api = {
  get: async (url: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get data from localStorage
    const key = url.replace('/api/', '');
    let data = null;

    // Special handling for analytics endpoints
    if (key === 'analytics/stats') {
      const stats = {
        pageViews: parseInt(localStorage.getItem('pageViews') || '0', 10),
        uniqueVisitors: parseInt(localStorage.getItem('uniqueVisitors') || '0', 10)
      };
      data = stats;
    } else if (key === 'analytics/activities') {
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      data = activities;
    } else if (key === 'contact') {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      data = messages;
    } else {
      data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null;
    }

    return { data };
  },

  post: async (url: string, data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const key = url.replace('/api/', '');

    // Special handling for analytics endpoints
    if (key === 'analytics/pageview') {
      const currentViews = parseInt(localStorage.getItem('pageViews') || '0', 10);
      const currentVisitors = parseInt(localStorage.getItem('uniqueVisitors') || '0', 10);
      const visitorIds = JSON.parse(localStorage.getItem('visitorIds') || '[]');

      localStorage.setItem('pageViews', (currentViews + 1).toString());
      
      if (!visitorIds.includes(data.visitorId)) {
        visitorIds.push(data.visitorId);
        localStorage.setItem('visitorIds', JSON.stringify(visitorIds));
        localStorage.setItem('uniqueVisitors', (currentVisitors + 1).toString());
      }
    } else if (key === 'contact') {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        ...data,
        date: new Date().toISOString()
      };
      messages.unshift(newMessage);
      localStorage.setItem('contactMessages', JSON.stringify(messages.slice(0, 50)));

      // Record activity
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        type: 'contact',
        description: `New contact message from ${data.email}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('activities', JSON.stringify(activities.slice(0, 50)));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
    
    return { data };
  },

  put: async (url: string, data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const key = url.replace('/api/', '');
    localStorage.setItem(key, JSON.stringify(data));

    // Record activity for content updates
    if (key.startsWith('content/')) {
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        type: 'content_update',
        description: `Content updated for ${key}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('activities', JSON.stringify(activities.slice(0, 50)));
    }

    return { data };
  },

  delete: async (url: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const key = url.replace('/api/', '');
    localStorage.removeItem(key);
    return { data: { success: true } };
  }
};

export default api;