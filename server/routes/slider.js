import express from 'express';
import Slider from '../models/Slider.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all slides
router.get('/', async (req, res) => {
  try {
    console.log('Fetching slides from database...');
    const slides = await Slider.find({ isActive: true }).sort('order');
    console.log('Found slides:', slides);
    res.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ 
      message: 'Error fetching slides from database',
      error: error.message 
    });
  }
});

// Add new slide (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { image, title, subtitle, buttonText, buttonLink, showLogo } = req.body;
    
    // Get highest order
    const highestOrder = await Slider.findOne().sort('-order');
    const newOrder = (highestOrder?.order ?? -1) + 1;

    const slide = await Slider.create({
      image,
      title: title || 'New Slide',
      subtitle: subtitle || 'Slide Description',
      buttonText,
      buttonLink,
      showLogo,
      order: newOrder,
      isActive: true
    });

    res.status(201).json({ 
      message: 'Slide successfully created',
      slide 
    });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ 
      message: 'Error saving slide to database',
      error: error.message 
    });
  }
});

// Update slide (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const slide = await Slider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    res.json({ 
      message: 'Slide successfully updated',
      slide 
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ 
      message: 'Error updating slide',
      error: error.message 
    });
  }
});

// Delete slide (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    await slide.deleteOne();
    res.json({ message: 'Slide successfully deleted' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ 
      message: 'Error deleting slide',
      error: error.message 
    });
  }
});

// Reorder slides (protected route)
router.patch('/:id/reorder', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { direction } = req.body;
    const slide = await Slider.findById(req.params.id);
    
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    const currentOrder = slide.order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    // Find slide to swap with
    const swapSlide = await Slider.findOne({ order: newOrder });
    if (swapSlide) {
      swapSlide.order = currentOrder;
      await swapSlide.save();
    }

    slide.order = newOrder;
    await slide.save();

    res.json({ message: 'Slides successfully reordered' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ 
      message: 'Error reordering slides',
      error: error.message 
    });
  }
});

export default router;