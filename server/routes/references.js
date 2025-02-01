import express from 'express';
import Reference from '../models/Reference.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all references
router.get('/', async (req, res) => {
  try {
    const references = await Reference.find().sort('order');
    res.json(references);
  } catch (error) {
    console.error('References fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reference (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reference = await Reference.create(req.body);
    res.status(201).json(reference);
  } catch (error) {
    console.error('Reference creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reference (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reference = await Reference.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(reference);
  } catch (error) {
    console.error('Reference update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reference (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Reference.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reference deleted successfully' });
  } catch (error) {
    console.error('Reference deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;