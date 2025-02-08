import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: false // Allow dynamic content structure
});

// Update timestamp on save
contentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Ensure content is always an object
contentSchema.pre('validate', function(next) {
  if (typeof this.content !== 'object') {
    this.content = {};
  }
  next();
});

// Add indexes for better performance
contentSchema.index({ page: 1, lastModified: -1 });

const Content = mongoose.model('Content', contentSchema);

export default Content;