import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['contact', 'login', 'content_update', 'settings_update', 'profile_update', 'equipment_update']
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
    default: Date.now,
    expires: 2592000 // 30 days TTL index
  }
});

// Add indexes for better performance
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ userId: 1 });

const Activity = mongoose.model('Activity', activitySchema);

// Helper function to create activity
export async function createActivity(data) {
  try {
    const activity = await Activity.create(data);
    console.log('Activity created:', activity);
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}

export default Activity;