import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all gallery images directly from Cloudinary
router.get('/', async (req, res) => {
  try {
    console.log('Fetching gallery images from Cloudinary');
    
    const result = await cloudinary.search
      .expression('folder:gallery')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    console.log('Cloudinary search result:', result);

    const images = result.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      alt: resource.public_id.split('/').pop() || '',
      title: resource.public_id.split('/').pop() || ''
    }));

    console.log(`Found ${images.length} images`);
    res.json({ images });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete image from Cloudinary (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const publicId = req.params.id;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
});

export default router;