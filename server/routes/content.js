import express from 'express';
import Content from '../models/Content.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get content for a specific page and section
router.get('/:page/:section?', async (req, res) => {
  try {
    console.log(`Fetching content for page: ${req.params.page}, section: ${req.params.section}`);
    const content = await Content.findOne({ page: req.params.page });
    
    if (!content) {
      console.log(`No content found for page: ${req.params.page}`);
      return res.status(404).json({ 
        message: 'Content not found',
        content: null 
      });
    }

    // If section is specified, return only that section
    if (req.params.section) {
      const sectionContent = content.content[req.params.section];
      if (!sectionContent) {
        return res.status(404).json({
          message: `Section ${req.params.section} not found`,
          content: null
        });
      }
      console.log(`Content found for section ${req.params.section}:`, sectionContent);
      return res.json({ content: sectionContent });
    }

    console.log(`Content found for page ${req.params.page}:`, content);
    res.json({ content: content.content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Error fetching content from database',
      error: error.message 
    });
  }
});

// Update content for a specific page and section
router.put('/:page/:section', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating content for page: ${req.params.page}, section: ${req.params.section}`);
    console.log('New content:', req.body);

    const updateQuery = {};
    updateQuery[`content.${req.params.section}`] = req.body;

    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { 
        $set: updateQuery,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: `Content updated for ${req.params.page} - ${req.params.section}`,
      userId: req.user._id,
      metadata: { page: req.params.page, section: req.params.section }
    });

    console.log(`Content successfully updated for ${req.params.page} - ${req.params.section}`);
    res.json({ 
      message: `Content for ${req.params.page} - ${req.params.section} successfully saved to MongoDB`,
      content: content.content[req.params.section]
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ 
      message: 'Error saving content to MongoDB',
      error: error.message 
    });
  }
});

export default router;