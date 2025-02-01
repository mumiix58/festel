import express from 'express';
import Contact from '../models/Contact.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Record activity
    await Activity.create({
      type: 'contact',
      description: `New contact message from ${req.body.email}`,
      metadata: { contactId: contact._id }
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages (protected route)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort('-createdAt')
      .limit(50);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update message status (protected route)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Record activity
    await Activity.create({
      type: 'content_update',
      description: `Message status updated to "${status}"`,
      userId: req.user._id,
      metadata: { messageId: message._id }
    });

    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;