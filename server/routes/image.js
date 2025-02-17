import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Image from '../models/Image.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get images by folder
router.get('/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    const images = await Image.find({ folder }).sort('-createdAt');
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image (protected route)
router.post('/upload', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const { folder = 'general', alt, title } = req.body;

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto'
    });

    // Save to MongoDB
    const image = await Image.create({
      cloudinaryId: result.public_id,
      url: result.secure_url,
      alt: alt || req.file.originalname,
      title: title || req.file.originalname,
      folder,
      metadata: {
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      }
    });

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: `New image uploaded to ${folder}`,
      userId: req.user._id,
      metadata: { imageId: image._id }
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
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from MongoDB
    await image.deleteOne();

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: `Image deleted from ${image.folder}`,
      userId: req.user._id,
      metadata: { imageId: image._id }
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;