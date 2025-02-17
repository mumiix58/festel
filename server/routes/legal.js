import express from 'express';
import Content from '../models/Content.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Get all legal content
router.get('/', async (req, res) => {
  try {
    const legalContent = await Content.findOne({ page: 'legal' });
    
    if (!legalContent?.content) {
      return res.status(404).json({ message: 'Legal content not found' });
    }

    res.json(legalContent.content);
  } catch (error) {
    console.error('Error fetching legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific legal content
router.get('/:type', async (req, res) => {
  try {
    const legalContent = await Content.findOne({ page: 'legal' });
    if (!legalContent?.content?.[req.params.type]) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ content: legalContent.content[req.params.type] });
  } catch (error) {
    console.error('Error fetching legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update legal content (protected route)
router.put('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { impressum, datenschutz, agb } = req.body;

    // Validate required fields
    if (!impressum || !datenschutz || !agb) {
      return res.status(400).json({ message: 'All legal content fields are required' });
    }

    // Update content in Content collection
    const legalContent = await Content.findOneAndUpdate(
      { page: 'legal' },
      {
        content: { impressum, datenschutz, agb },
        lastModified: new Date()
      },
      { upsert: true, new: true }
    );

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: 'Legal content updated',
      userId: req.user._id
    });

    res.json(legalContent.content);
  } catch (error) {
    console.error('Error updating legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update specific legal content (protected route)
router.put('/:type', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    const { type } = req.params;

    // Validate content
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Validate type
    if (!['impressum', 'datenschutz', 'agb'].includes(type)) {
      return res.status(400).json({ message: 'Invalid legal content type' });
    }

    // Get existing content
    let legalContent = await Content.findOne({ page: 'legal' });
    
    if (!legalContent) {
      legalContent = new Content({
        page: 'legal',
        content: {}
      });
    }

    // Update specific content type
    legalContent.content[type] = content;
    legalContent.lastModified = new Date();
    await legalContent.save();

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: `${type} content updated`,
      userId: req.user._id
    });

    res.json(legalContent.content);
  } catch (error) {
    console.error('Error updating legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;