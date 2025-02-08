import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Slider from '../models/Slider.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('Adding new slide...');
    
    if (!req.file) {
      throw new Error('No image file provided');
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading image to Cloudinary...');
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'slider',
      resource_type: 'auto'
    });
    console.log('Image uploaded to Cloudinary:', result.secure_url);

    // Get current highest order
    const highestOrder = await Slider.findOne().sort('-order');
    const newOrder = (highestOrder?.order ?? -1) + 1;

    const slide = await Slider.create({
      image: result.secure_url,
      title: 'New Slide',
      subtitle: 'Slide Description',
      order: newOrder,
      isActive: true
    });

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'New slider slide added',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

    console.log('New slide saved to database:', slide);
    res.status(201).json({ 
      message: 'Slide successfully saved to database',
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

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'Slider slide updated',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

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

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'Slider slide deleted',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

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

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'Slider slides reordered',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

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