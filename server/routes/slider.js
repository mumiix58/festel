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
    const slides = await Slider.find().sort('order');
    res.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new slide (protected route)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'slider',
      resource_type: 'auto'
    });

    const slide = await Slider.create({
      image: result.secure_url,
      title: 'New Slide',
      subtitle: 'Slide Description',
      order: await Slider.countDocuments(),
      isActive: true
    });

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'New slider slide added',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ message: 'Server error' });
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

    res.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete slide (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Delete image from Cloudinary if it exists
    if (slide.image) {
      const publicId = slide.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`slider/${publicId}`);
      }
    }

    await slide.deleteOne();

    // Log activity
    await Activity.create({
      type: 'content_update',
      description: 'Slider slide deleted',
      userId: req.user._id,
      metadata: { slideId: slide._id }
    });

    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ message: 'Server error' });
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

    res.json({ message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;