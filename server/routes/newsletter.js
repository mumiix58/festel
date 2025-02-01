import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName, preferences } = req.body;

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.subscribed) {
        return res.status(400).json({ message: 'Already subscribed' });
      }

      subscriber.subscribed = true;
      subscriber.unsubscribedAt = null;
      subscriber.preferences = preferences || subscriber.preferences;
      await subscriber.save();
    } else {
      subscriber = await Newsletter.create({
        email,
        firstName,
        lastName,
        preferences
      });
    }

    res.status(201).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    subscriber.subscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subscribers (protected route)
router.get('/subscribers', authenticateToken, isAdmin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort('-subscribedAt');
    res.json(subscribers);
  } catch (error) {
    console.error('Subscribers fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscriber preferences (protected route)
router.put('/subscribers/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(subscriber);
  } catch (error) {
    console.error('Subscriber update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;