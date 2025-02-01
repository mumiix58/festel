import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Document from '../models/Document.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get public documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({
      isActive: true,
      isPublic: true,
      validFrom: { $lte: new Date() },
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gte: new Date() } }
      ]
    }).sort('-createdAt');
    res.json(documents);
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all documents (protected route)
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .sort('-createdAt');
    res.json(documents);
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document (protected route)
router.post('/', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'documents',
      resource_type: 'auto'
    });

    const document = await Document.create({
      ...req.body,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format
      },
      createdBy: req.user._id
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document (protected route)
router.put('/:id', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    let updates = { ...req.body, updatedBy: req.user._id };
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'documents',
        resource_type: 'auto'
      });
      
      updates.file = {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format
      };
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
    .populate('createdBy', 'firstName lastName')
    .populate('updatedBy', 'firstName lastName');

    res.json(document);
  } catch (error) {
    console.error('Document update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (document?.file?.publicId) {
      await cloudinary.uploader.destroy(document.file.publicId);
    }
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track document download
router.post('/:id/download', async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.json(document);
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;