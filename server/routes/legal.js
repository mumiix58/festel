import express from 'express';
import Legal from '../models/Legal.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Get all legal content
router.get('/', async (req, res) => {
  try {
    const legalContent = await Legal.find();
    
    // Transform to expected format
    const content = legalContent.reduce((acc, item) => {
      acc[item.type] = item.content;
      return acc;
    }, {});

    // Ensure all required fields exist
    if (!content.impressum || !content.datenschutz || !content.agb) {
      return res.status(404).json({ message: 'Legal content incomplete' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error fetching legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific legal content
router.get('/:type', async (req, res) => {
  try {
    const legal = await Legal.findOne({ type: req.params.type });
    if (!legal) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(legal);
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

    // Update each type of legal content
    const updates = [
      { type: 'impressum', content: impressum },
      { type: 'datenschutz', content: datenschutz },
      { type: 'agb', content: agb }
    ];

    for (const update of updates) {
      await Legal.findOneAndUpdate(
        { type: update.type },
        { content: update.content, lastModified: new Date() },
        { upsert: true, new: true }
      );
    }

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: 'Legal content updated',
      userId: req.user._id
    });

    res.json({ message: 'Legal content updated successfully' });
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

    const legal = await Legal.findOneAndUpdate(
      { type },
      { content, lastModified: new Date() },
      { upsert: true, new: true }
    );

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: `${type} content updated`,
      userId: req.user._id
    });

    res.json(legal);
  } catch (error) {
    console.error('Error updating legal content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;