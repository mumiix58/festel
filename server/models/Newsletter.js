import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: String,
  lastName: String,
  subscribed: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: Date,
  lastEmailSent: Date,
  preferences: {
    events: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    },
    news: {
      type: Boolean,
      default: true
    }
  }
});

export default mongoose.model('Newsletter', newsletterSchema);