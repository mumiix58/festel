import express from 'express';
import FAQ from '../models/FAQ.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort('order');
    res.json(faqs);
  } catch (error) {
    console.error('FAQs fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create FAQ (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    console.error('FAQ creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update FAQ (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(faq);
  } catch (error) {
    console.error('FAQ update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete FAQ (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('FAQ deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;