import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['contact', 'login', 'content_update', 'settings_update', 'profile_update']
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

activitySchema.index({ createdAt: -1 });

export default mongoose.model('Activity', activitySchema);