import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Slider from '../models/Slider.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all slides
router.get('/', async (req, res) => {
  try {
    console.log('Fetching slides from database...');
    const slides = await Slider.find().sort('order');
    console.log(`Found ${slides.length} slides`);
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
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'slider',
      resource_type: 'image'
    });

    // Get highest order
    const highestOrder = await Slider.findOne().sort('-order');
    const newOrder = (highestOrder?.order ?? -1) + 1;

    // Create slide
    const slide = await Slider.create({
      image: uploadResponse.secure_url,
      cloudinaryPublicId: uploadResponse.public_id,
      title: req.body.title || 'New Slide',
      subtitle: req.body.subtitle || 'Slide Description',
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
      showLogo: req.body.showLogo === 'true',
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
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      // Delete old image from Cloudinary
      const oldSlide = await Slider.findById(req.params.id);
      if (oldSlide?.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(oldSlide.cloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Upload new image
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'slider',
        resource_type: 'image'
      });

      updates.image = uploadResponse.secure_url;
      updates.cloudinaryPublicId = uploadResponse.public_id;
    }

    const slide = await Slider.findByIdAndUpdate(
      req.params.id,
      updates,
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

    // Delete image from Cloudinary
    if (slide.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(slide.cloudinaryPublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await slide.deleteOne();

    // Reorder remaining slides
    const remainingSlides = await Slider.find().sort('order');
    for (let i = 0; i < remainingSlides.length; i++) {
      remainingSlides[i].order = i;
      await remainingSlides[i].save();
    }

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