import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Record page view
router.post('/pageview', async (req, res) => {
  try {
    const { visitorId } = req.body;
    
    await Activity.create({
      type: 'page_view',
      description: 'Page viewed',
      metadata: { visitorId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording page view:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest activities (protected route)
router.get('/activities', authenticateToken, isAdmin, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort('-createdAt')
      .limit(20)
      .populate('userId', 'email firstName lastName')
      .lean();

    // Format activities for display
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      user: activity.userId ? `${activity.userId.firstName} ${activity.userId.lastName}` : 'System',
      timestamp: activity.createdAt,
      metadata: activity.metadata || {}
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics stats (protected route)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get last 30 days stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total messages
    const totalMessages = await Activity.countDocuments({
      type: 'contact',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get page views and visitors
    const pageViews = await Activity.countDocuments({
      type: 'page_view',
      createdAt: { $gte: thirtyDaysAgo }
    });

    const uniqueVisitors = await Activity.distinct('metadata.visitorId', {
      type: 'page_view',
      createdAt: { $gte: thirtyDaysAgo }
    }).then(visitors => visitors.length);

    res.json({
      totalMessages,
      pageViews,
      uniqueVisitors
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save contact message
router.post('/contact', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    await Activity.create({
      type: 'contact',
      description: `New contact message from ${email}`,
      metadata: { email, subject, message }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;