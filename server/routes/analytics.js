import express from 'express';
import Analytics from '../models/Analytics.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Record page view
router.post('/pageview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitorId = req.body.visitorId;

    let analytics = await Analytics.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!analytics) {
      analytics = new Analytics({
        date: today,
        pageViews: 1,
        uniqueVisitors: 1,
        visitorIds: [visitorId]
      });
    } else {
      analytics.pageViews += 1;
      if (!analytics.visitorIds.includes(visitorId)) {
        analytics.uniqueVisitors += 1;
        analytics.visitorIds.push(visitorId);
      }
    }

    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording page view:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics stats (protected route)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await Analytics.find({
      date: { $gte: thirtyDaysAgo }
    }).sort('-date');

    const totals = analytics.reduce((acc, curr) => ({
      pageViews: acc.pageViews + curr.pageViews,
      uniqueVisitors: acc.uniqueVisitors + curr.uniqueVisitors
    }), { pageViews: 0, uniqueVisitors: 0 });

    res.json(totals);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest activities (protected route)
router.get('/activities', authenticateToken, isAdmin, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort('-createdAt')
      .limit(20)
      .populate('userId', 'email');

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;