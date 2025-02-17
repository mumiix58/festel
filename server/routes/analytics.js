import express from 'express';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get latest activities (protected route)
router.get('/activities', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Fetching latest activities...');
    
    const activities = await Activity.find()
      .sort('-createdAt')
      .limit(20)
      .populate('userId', 'email firstName lastName')
      .lean();

    console.log(`Found ${activities.length} activities`);
    
    // Format activities for display
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      user: activity.userId ? `${activity.userId.firstName} ${activity.userId.lastName}` : 'System',
      timestamp: activity.createdAt,
      metadata: activity.metadata
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;