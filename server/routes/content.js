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

// Update entire page content
router.put('/:page', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating content for page: ${req.params.page}`);
    
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        message: 'Invalid request body'
      });
    }

    // Update or create document
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { 
        content: req.body,
        lastModified: new Date()
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    );

    if (!content) {
      throw new Error('Failed to update content');
    }

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: `Content updated for ${req.params.page}`,
      userId: req.user._id,
      metadata: { page: req.params.page }
    });

    res.json({ 
      message: 'Content saved successfully',
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

// Gallery-specific endpoints
router.get('/gallery/images', async (req, res) => {
  try {
    const content = await Content.findOne({ page: 'gallery' });
    res.json({ 
      content: {
        images: content?.content?.images || []
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/gallery/images', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { image } = req.body;
    let content = await Content.findOne({ page: 'gallery' });
    
    if (!content) {
      content = await Content.create({
        page: 'gallery',
        content: { images: [image] }
      });
    } else {
      content.content.images = [...(content.content.images || []), image];
      await content.save();
    }

    res.json({ 
      message: 'Image added successfully',
      image 
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/gallery/images/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const content = await Content.findOne({ page: 'gallery' });
    if (!content) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    content.content.images = content.content.images.filter(
      img => img.id !== req.params.id
    );
    await content.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;