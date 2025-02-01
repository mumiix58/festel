import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Settings from '../models/Settings.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload logo (protected route)
router.post('/logo', authenticateToken, isAdmin, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'logos',
      resource_type: 'auto'
    });

    const settings = await Settings.findOneAndUpdate(
      {},
      { 'company.logo': result.secure_url },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Logo uploaded successfully',
      logo: settings.company.logo
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (protected route)
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [analytics, activities, messages] = await Promise.all([
      Analytics.find({ date: { $gte: thirtyDaysAgo } }).sort('-date'),
      Activity.find().sort('-createdAt').limit(10).populate('userId', 'email'),
      Contact.find().sort('-createdAt').limit(5)
    ]);

    const totals = analytics.reduce((acc, curr) => ({
      pageViews: acc.pageViews + curr.pageViews,
      uniqueVisitors: acc.uniqueVisitors + curr.uniqueVisitors
    }), { pageViews: 0, uniqueVisitors: 0 });

    res.json({
      stats: totals,
      activities,
      messages
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;