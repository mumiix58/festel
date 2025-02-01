import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  pageViews: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  visitorIds: [{
    type: String
  }]
});

analyticsSchema.index({ date: 1 });

export default mongoose.model('Analytics', analyticsSchema);