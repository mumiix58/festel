import express from 'express';
import Content from '../models/Content.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get content for a specific page
router.get('/:page', async (req, res) => {
  try {
    console.log(`Fetching content for page: ${req.params.page}`);
    const content = await Content.findOne({ page: req.params.page });
    
    if (!content) {
      console.log(`No content found for page: ${req.params.page}`);
      return res.status(404).json({ 
        message: 'Content not found',
        content: null 
      });
    }

    console.log(`Content found for page: ${req.params.page}`);
    res.json({ content: content.content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Error fetching content from database',
      error: error.message 
    });
  }
});

// Update content (protected route)
router.put('/:page', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating content for page: ${req.params.page}`);
    console.log('New content:', req.body);

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

    console.log(`Content successfully updated for page: ${req.params.page}`);
    res.json({ 
      message: `Content for ${req.params.page} successfully saved to database`,
      content: content.content 
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ 
      message: 'Error saving content to database',
      error: error.message 
    });
  }
});

export default router;