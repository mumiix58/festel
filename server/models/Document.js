import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['menu', 'brochure', 'price_list', 'contract', 'terms', 'other']
  },
  category: {
    type: String,
    required: true
  },
  file: {
    url: {
      type: String,
      required: true
    },
    publicId: String,
    size: Number,
    format: String
  },
  version: {
    type: String,
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: Date,
  language: {
    type: String,
    default: 'de'
  },
  tags: [{
    type: String
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Update timestamp on save
documentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Document', documentSchema);