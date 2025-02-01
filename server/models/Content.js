import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
contentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

export default mongoose.model('Content', contentSchema);