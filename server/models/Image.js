import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  cloudinaryId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  folder: {
    type: String,
    required: true,
    enum: ['gallery', 'slider', 'services', 'equipment', 'team', 'general']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
imageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for better performance
imageSchema.index({ folder: 1 });
imageSchema.index({ cloudinaryId: 1 });
imageSchema.index({ createdAt: -1 });

const Image = mongoose.model('Image', imageSchema);

export default Image;