import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Gallery from '../models/Gallery.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image (protected route)
router.post('/upload', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'gallery',
      resource_type: 'auto'
    });

    const image = await Gallery.create({
      url: result.secure_url,
      publicId: result.public_id,
      alt: req.body.alt || req.file.originalname,
      title: req.body.title || req.file.originalname
    });

    res.json(image);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await image.deleteOne();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;