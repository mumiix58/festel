import express from 'express';
import Content from '../models/Content.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get content for a specific page
router.get('/:page', async (req, res) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    console.log(`Content fetched from MongoDB for page: ${req.params.page}`);
    res.json({ content: content?.content || null });
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ message: 'Error fetching content from database' });
  }
});

// Update content (protected route)
router.put('/:page', authenticateToken, isAdmin, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { 
        content: req.body,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: `Content updated for page: ${req.params.page}`,
      userId: req.user._id,
      metadata: { page: req.params.page }
    });

    console.log(`Content successfully saved to MongoDB for page: ${req.params.page}`);
    res.json({ 
      message: `Content for ${req.params.page} successfully saved to database`,
      content: content.content 
    });
  } catch (error) {
    console.error('Content update error:', error);
    res.status(500).json({ message: 'Error saving content to database' });
  }
});

export default router;