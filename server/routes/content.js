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
    console.log('Update data:', req.body);
    
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

    console.log('Updated content:', content);
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

// Update specific section
router.put('/:page/:section', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating section ${req.params.section} for page: ${req.params.page}`);
    console.log('Update data:', req.body);
    
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        message: 'Invalid request body'
      });
    }

    // Create update query
    const updateQuery = {};
    updateQuery[`content.${req.params.section}`] = req.body;

    // Update document
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { 
        $set: updateQuery,
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
      description: `Section ${req.params.section} updated for ${req.params.page}`,
      userId: req.user._id,
      metadata: { page: req.params.page, section: req.params.section }
    });

    console.log('Updated content:', content);
    res.json({ 
      message: 'Content saved successfully',
      content: content.content[req.params.section]
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