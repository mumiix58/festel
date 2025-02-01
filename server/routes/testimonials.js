import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Testimonial from '../models/Testimonial.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('order');
    res.json(testimonials);
  } catch (error) {
    console.error('Testimonials fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create testimonial (protected route)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let imageUrl;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'testimonials',
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      image: imageUrl
    });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update testimonial (protected route)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'testimonials',
        resource_type: 'auto'
      });
      updates.image = result.secure_url;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(testimonial);
  } catch (error) {
    console.error('Testimonial update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete testimonial (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Testimonial deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;